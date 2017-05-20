title: Java 中实例化一个抽象类对象的方式
date: 2017-04-07 19:39:24
tags: [Java, Android]

---

在 Java 中抽象类是不能直接被实例化的。但是很多时候抽象类的该特点成为一个比较麻烦的阻碍。例如如果我想使用动态代理来给一个抽象类赋予其执行抽象方法的能力，就会有两个困难：1. 动态代理只能创建实现接口的一个代理对象，而不能是一个继承抽象类的对象。为此标准的 JVM 中有一些实现，例如 javassist 可以使用字节码工具来完成这一目的(ProxyFactory)。

<!--more-->

在 Android 中如果想构造一个抽象类对象，恐怕只有 `new ClassName() {}` 或者继承之后构造了。但是这两种方法都是不能由其 Class 对象直接操作的，这就导致一些问题上达不到我们需要的抽象能力。这里详细描述一下第一段所说的场景：

1. 首先有一个 interface 文件定义如下（熟悉 Android 的朋友可以看出这是一个提供给 Retrofit 生成代理对象的 Api 配置接口）：
   ```java
   public interface RealApi {
     
     @GET("api1")
     Observable<String> api1();
     
     @GET("api2")
     Observable<String> api2();
     
     @GET("api3")
     Observable<String> api3();
     //...其他方法
   }
   ```
2. 其次再写一个抽象类，只实现接口的其中一个方法（用来模拟接口数据）：
   ```java
   @MockApi
   public abstract class MockApi implements RealApi {
     Observable<String> api3() {
       return Observable.just("mock data");
     }
   }
   ```
3. 然后我们需要有一个工具，例如 `MockManager` ，让他结合我们已存在的 `RealApi` 对象和 `MockApi` 类，来构造出一个混合对象，该对象在执行 `MockApi` 中已经定义的方法时，为直接执行，在 `MockApi ` 没有定义该方法时，去调用 `RealApi` 的方法。其调用方式大概为：
   ```java
   RealApi api = MockManager.build(realApi, MockApi.class);
   ```

通过 `javassist`，完成上述功能很简单，创建一个 `ProxyFactory` 对象，设置其 `Superclass` 为` MockApi`，然后过滤抽象方法，设置 method handler 调用 `realApi` 对象的同名同参方法。这里就不再给出代码实现。

但是在 Android 上，javassist 的该方法会抛出 
```
    Caused by: java.lang.UnsupportedOperationException: can't load this type of class file 
          at java.lang.ClassLoader.defineClass(ClassLoader.java:520)
          at java.lang.reflect.Method.invoke(Native Method)
          at javassist.util.proxy.FactoryHelper.toClass2(FactoryHelper.java:182)
```

类似的异常。原因大概是 Android 上的虚拟机的实现和标准略微不同，所以这里把方向转为了动态代码生成的另一个方向 Annotation Processor。

使用 Annotation Processor 实现的话，思路就简单的多了，但过程还是有些曲折：

1. 首先定义一个注解，用来标记需要构造对象的抽象类

   ```java
   @Target(ElementType.TYPE)
   @Documented
   @Retention(RetentionPolicy.SOURCE)
   public @interface MockApi {
   }
   ```

2. Processor 根据注解来获得类的 element 对象，该对象是一个类似 class 的对象。因为在预编译阶段，class 尚未存在，此时使用 Class.forName 是不可以获取运行时需要的 Class 对象的，但是 Element 提供了类似 Class 反射相关的方法，也有 TypeElement、ExecutableElement 等区分。使用 Element 对象分析注解的抽象类的抽象方法有哪些，生成一个继承该类的实现类（非抽象），并在该类中实现所有抽象方法，因为不会实际用到这些抽象方法，所以只需要能编译通过就可以了，我选择的方式是每个方法体都抛出一个异常，提示该方法为抽象方法不能直接调用。生成代码的方法可以使用一些工具来简化工作，例如 AutoProcessor 和 JavaPoet，具体实现参考文尾的项目代码，生成后的代码大致像这样：

   ```java
   // 生成的类名使用原类名+"$Impl"的后缀来命名，避免和其他类名冲突，后面也使用该约束进行反射来调用该类
   public final class MockApi$Impl extends MockApi {
     @Override
     public Observable<String> api1() {
       throw new IllegalStateException("api1() is an abstract method!");
     }

     @Override
     public Observable<String> api2() {
       throw new IllegalStateException("api2() is an abstract method!");
     }
   }
   ```

3. 根据该抽象类的类名去反射获得该实现类，然后再根据反射调用其构造方法构造出一个实现对象。
   ```java
   // 获得生成代码构造的对象
   private static <T> T getImplObject(Class<T> cls) {
     try {
       return (T) Class.forName(cls.getName() + "$Impl").newInstance();
     } catch (Exception e) {
       return null;
     }
   }
   ```

4. 构造一个动态代理，传入 RealApi 的真实对象，和上一步构造出的抽象类的实现对象，根据抽象类中的定义来判断由哪个对象代理其方法行为：如果抽象类中有定义，即该方法不是抽象方法，则抽象类的实现对象执行；反之，由接口的真实对象执行。
   ```java
   public static <Origin, Mock extends Origin> Origin build(final Origin origin, final Class<Mock> mockClass) {

     // 如果 Mock Class 标记为关闭，则直接返回真实接口对象
     if (!isEnable(mockClass)) {
       return origin;
     }

     final Mock mockObject = getImplObject(mockClass);

     Class<?> originClass = origin.getClass().getInterfaces()[0];

     return (Origin) Proxy.newProxyInstance(originClass.getClassLoader(), new Class[]{originClass}, new InvocationHandler() {
       
       @Override
       public Object invoke(Object o, Method method, Object[] objects) throws Throwable {
         
         // 获取定义的抽象类中的同名方法，判断是否已经实现
         Method mockMethod = null;
         try {
           mockMethod = mockClass.getDeclaredMethod(method.getName(), method.getParameterTypes());
         } catch (NoSuchMethodException ignored) {
         }
         
         if (mockMethod == null || Modifier.isAbstract(mockMethod.getModifiers())) {
           return method.invoke(origin, objects);
         } else {
           return mockMethod.invoke(mockObject, objects);
         }
       }
     });
   }
   ```

完成上述工作以后，就可以像开头所说的那样，使用 `build` 方法来构造一个混合了真实接口和抽象类方法的代理对象了，虽然调用的类本质上还是硬编码，但是由 Annotation Processor 自动生成免于手动维护，使用上来讲和使用 Javassist 实现还是基本相同的。

我用本文中所属的方法实现了一个模拟 retrofit 请求的工具（文尾有链接），但本质上可以用它来实现很多需要构造抽象类的需求，更多的使用场景还有待挖掘。

> 文中提到的源码实现可以在项目 [retrofit-mock-result](https://github.com/twiceyuan/retrofit-mock-result) 中找到；
>
> 因作者技术能力有限，可能有更好的实现方式也欢迎指正
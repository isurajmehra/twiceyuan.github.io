title: Android 项目中配置服务器地址的方案演变
date: 2019-01-25 16:06:07
tags: [Android]

---
在客户端开发时，经常会遇到一个非业务需求——更换服务器的 Base URL。一般的情况是测试环境和生产环境之间相互切换。

<!--more-->

### 手动修改

最初的时候，我们使用的方式是最原始、手动的：定义一个常量，开发的时候改成测试服务器的地址，上线前改成生产服务器的地址。在项目的初期，一个 App 项目里只会和一个服务器打交道时，这种方式是最自然、简单的。

### 通过一个常量做同一控制

随着项目的迭代，可能出现很多服务器的情况。例如我们现在维护的一个 App，大概会和 6~10 个服务器进行通讯。当需要数据交互的服务器变多时，每次切换要改一堆服务器着实有点丑陋，所以后来项目的维护者又定义了一个常量：isDevEnv。从名字就可以看出来代表的是是否为开发环境，通过对这个常量的判断，来决定是否使用测试环境，类似这样：

```kotlin
String releaseMainUrl = "https://twiceyuan.com"
String debugMainUrl = "https://dev.twiceyuan.com"
String mainUrl = if (isDevEnv) debugMainUrl else releaseMainUrl
```

后来知道了有 BuildConfig.DEBUG 这个 gradle 自动维护的常量，isDevEnv 就可以用它来代替，这样服务环境的切换似乎更加自动化了。

### 存在的问题

然而这样还是有一些问题：

1. 每次切换其实只是一个常量的修改，但是切换 BuildType 常常需要一次漫长的 Gradle Sync 过程，并且在这之后还需要再编译一次项目；
2. 随着时间的推移以及需要接入的新服务器的添加，发现切换服务器并不是之前设想的一刀切，要么全是测试要么全是生产的模式，而是有时新加入的服务器，需要在测试阶段对接产品的生产数据；
3. 有时后端可能需要临时设置一个服务器地址（比如局域网自己机器的），这时候还要麻烦客户端开发来把这个常量改一下打个包给后端，然后再改回来。

### 理想的方案

针对这些问题，理想的方案需要满足以下几点需求：

1. 能够在项目用通过代码配置测试服务器和生产服务器
2. 针对第一部配置的服务器，能够设置一个默认值，并且运行时可以选择这个值
3. 针对测试服务器的选项，可以根据需要运行时修改这个值。
4. 生产版本不允许修改这个值。

有在运行时改变的功能，就需要对数据进行持久化，以方便下次启动时能够仍然使用之前设置的值。所以针对每一项需要持久化的数据为：目前选择的是哪个服务器选项（没有保存过就使用默认的），该选项的值（没有修改过也是取默认的）。另外需要有一个完整的配置界面，可以修改对应的值。

根据上面提到的需求，首先我们似乎需要定义一个可供配置的服务器 model：

```java
public class Variable implements Serializable {
    public String name;                 // 名称
    public String desc;                 // 说明
    public Item currentValue;           // 默认值/当前选项
    public ArrayList<Item> selections;  // 可选项
}
```
同时每个选项可以配置名称、值以及是否可以编辑：
```java
public static class Item implements Serializable {
    public final String name;        // 选项名称
    public final boolean isEditable; // 是否可编辑
    public String value;             // 选项值
}
```
因为获取一个 Variable 对象值时，可能需要拦截操作比如判断是否从缓存取还是外存中取，所以选择使用了动态代理+ interface 定义，类似 retrofit 定义的方式实现。

比如下面就是一个正常的服务器定义：

```kotlin
class CRM {
    // 测试服务器可在运行时编辑
    class Debug : Variable.Item("测试", "http://debug.server", isEditable = true) 
    // 生产服务器不可编辑
    class Release : Variable.Item("生产", "http://release.server")
    // 默认选择提供者
    class Default : Variable.DefaultItemProvider {
        override fun provide(): Class<out Variable.Item> {
            return Release::class.java
        }
    }
}
```

之后就是这个服务器的真正配置，默认服务器采用定义提供者 class 也是这个原因，因为注解无法赋值一个非常量，所以需要定义一个实现选择服务器逻辑的 class 用来放到注解值：

```kotlin
interface ServerConfig {
    //...
    @VariableProp(
        name = "crm", desc = "CRM 服务器",
        selections = [CRM.Debug::class, CRM.Release::class],
        defaultValue = CRM.Default::class
    )
    fun crm(): Variable
    //...
}
```
这样以来，对于使用者来说的配置工作就完成了。它背后的原理其实也很简单：

首先通过 Proxy 根据定义的 ServerConfig 接口创建一个代理对象，来获取调用方法的注解属性。获取的方式有一个优先级，即先判断缓存变量中是否有，再判断外寸中缓存的配置是否有(有的话缓存到内存)，都没有的话，根据注解获取默认值，再缓存到内存中：

```java
private static final Map<String, Variable> cache = new ConcurrentHashMap<>();

private static Variable getEnvVariableByAnnotation(Context context, VariableProp variableAnnotation) {
    String name = variableAnnotation.name();

    // 1. 内存中有优先使用内存的
    Variable cachedVariable = cache.get(name);

    if (cachedVariable != null) {
    return cachedVariable;
    }

    // 2. 判断外存中是否有，有的话取外存并缓存到内存中
    Variable diskCachedVariable = readFromDisk(context, name);
    if (diskCachedVariable != null) {
    cache.put(name, diskCachedVariable);
    return diskCachedVariable;
    }

    // 3. 都没有，则根据注解获取默认的
    Variable newVariable = generateVariableByDefault(variableAnnotation);

    // 缓存到内存中
    cache.put(name, newVariable);

    return newVariable;
}
```

这些变量的配置页面，也可以通过相同的方法，反射 interface 来获取，同时配置页面做过的改动，应用到内存和外寸，开发者可以通过重启应用或者自定义刷新依赖这些变量的地方来通知这些变更。

项目的实现和例子都分享到了 GitHub 上，欢迎 Star 或 PR：https://github.com/twiceyuan/EnvVariable/


title: Dagger 2 中 Scope 用法
date: 2016-01-15 15:38:33
tags: [Android, Dagger 2]

---

### Dagger 2 简介

Dagger 2 是 Google 对 Square 下的项目 Dagger fork 出来的 Android IoC 框架，替换了原 Dagger 的反射使用代码生成进行注入，并添加了一些新特性。

### @Scope

Dagger 1 中对注入对象的的注解只有 Singleton，而 Dagger 2 中可以使用 Scope 自定义注解来指定注入对象的作用域，来实现局部单例的效果。看了很多介绍文档都不是很清楚，使用 find usage 发现并没有生成代码对注解进行监听，推测 Scope 是影响了代码生成的结果。这里举个例子来说明如何使用 Scope 注解。

<!-- more -->

（参考问题：http://stackoverflow.com/questions/29923376/dagger2-custom-scopes-how-do-custom-scopes-activityscope-actually-work）

首先，Dagger 2 中为注解了自定义 Scope 的 Component 里每一个 Module 中的 Provider 都创建了一个实例。因此在一个 Module 中想要获得一个单例的 Provider，你需要指定 Module 中 Provider 方法的为自定义的 Scope。

```
@Module
public class YourModule {
    @Provides
    @YourScope // 每个 component 一个实例
    public Something something() { return new SomethingImpl(); }

    @Provides // 每次注入创建一个新实例
    public Otherthing otherthing() { return new OtherthingImpl(); }
}
```

```
@Component
@YourScope
public interface YourComponent {
    Something something();
    Otherthing otherthing();

    void inject(YourThing yourThing);
}
```

也有人指出，本质上一个 Scope 只能确定自身和其他 Scope 是不同的，所以使用 Component 的依赖也可以创建一个二级 Scope。

```
@Module
public class SubModule {
    @Provides
    @SubScope
    public ThatThing thatThing() { return new ThatThingImpl(); }
}
```

```
@Component(dependencies={YourComponent.class}, modules={SubModule.class})
@SubScope
public interface SubComponent extends YourComponent {
    ThatThing thatThing();

    void inject(SubThing subThing);
}
```

另外一个 Component 只可以依赖一个其他 Scope 的 Component。
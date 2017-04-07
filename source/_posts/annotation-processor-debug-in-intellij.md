title: Intellij IDEA 下调试 Annotation Processor 代码的配置
date: 2017-03-21 13:33:48
tags: [Android Studio, Java]

---
Annation Processor 是 Java 中静态分析注解并在预编译期生成代码常用的一个技术，因为不属于运行时代码，所以调试起来和普通代码有些不同，这里记录一下调试 Annotation Processor 代码的方法(Intellij 或 Android Studio)。

<!-- more -->

```
# 关闭 gradle daemon
./gradlew --stop
./gradlew --no-daemon -Dorg.gradle.debug=true :app:clean :app:compileDebugJavaWithJavac
```

新建 Remote 运行配置：

```
-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005

-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=5005

-Xnoagent -Djava.compiler=NONE -Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=5005
```

```
localhost 5005
```

先运行 Remote，再运行 connectedCheck（debug 模式的 gradle 任务），就可以切入断点了。

参考资料：https://blog.xmartlabs.com/2016/03/28/Debugging-an-Annotator-Processor-in-your-project/


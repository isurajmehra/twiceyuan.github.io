title: How to speed up gradle build time
tags: [Android,Android Studio]
date: 2015-04-15 07:31:21

---

If you use the new Gradle build system with Android (or Android Studio) you might have realized, that even the simplest Gradle call (e.g. gradle project or grade tasks) is pretty slow. On my computer it took around eight seconds for that kind of Gradle calls. <a id="more"></a>You can decrease this startup time of Gradle (on my computer down to two seconds), if you tell Gradle to use a daemon to build. Just create a file named gradle.properties in the following directory:

*   /home/<username>/.gradle/ (Linux)</username>
*   /Users/<username>/.gradle/ (Mac)</username>
*   C:\Users\<username>.gradle (Windows)</username>

Add this line to the file:

    org<span class="class">.gradle</span><span class="class">.daemon</span>=true
    `</pre>
    
    From now on Gradle will use a daemon to build, whether you are using Gradle from command line or building in Android Studio. You could also place the gradle.properties file to the root directory of your project and commit it to your SCM system. But you would have to do this, for every project (if you want to use the daemon in every project).
    
    Note: If you don’t build anything with Gradle for some time (currently 3 hours), it will stop the daemon, so that you will experience a long start-up time at the next build.
    
    Note：Performance improvements are one of the great tasks in the Gradle roadmap for 2014 (and reaching into 2015). So I hope, we’ll see the general performance increasing within these years.
    
    Note: This does only affect console builds. Android Studio always uses a Gradle daemon (and depending on your settings some other optimizations).
    
    > 来源：[https://www.timroes.de/2013/09/12/speed-up-gradle/](https://www.timroes.de/2013/09/12/speed-up-gradle/)
> 
>     （_至今没过英语四级的人的蹩脚翻译仅供参考_）

    如果你使用新的 Gradle 构建系统（或 Android Studio）你也许认识到简单的 Gradle 调用（例如 gradle project 或者 gradle tasks）是如此之慢。在我的电脑上那些gradle 调用要花 8 秒左右。如果你告诉 Gradle 使用一个后台驻留进程去构建就可以减少 Gradle 的启动时间。只需要创建一个名为`gradle.properties`在下面的文件夹中：

*   /home/<username>/.gradle/ (Linux)</username>
*   /Users/<username>/.gradle/ (Mac)</username>
*   C:\Users\<username>.gradle (Windows)</username>

    在该文件中添加这样一行：

    <pre>`org<span class="class">.gradle</span><span class="class">.daemon</span>=true

现在无论你使用 Gradle 命令行还是在 Android Studio 中， Gradle 将使用一个驻留进程去构建项目。你可以把`gradle.properties`文件放在你项目的根目录并提交到你的 SCM 系统。但是你必须每个项目都这样做（如果你想每个项目都使用后台驻留进程）。

Note：如果你在一段时间（当前是3小时）内不使用 Gradle 构建任何东西，它将会终止这个进程，那么你会在下一次构建时花费很长时间。

Note：不会翻译。

Note：这个只会影响控制台的构建。Android Studio 总是会使用一个 gradle 后台驻留进程（并且依靠于你设置上的其他优化）
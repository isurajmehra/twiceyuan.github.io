title: Android 绑定 View 终极利器——ButterKnife
tags: [Android]
date: 2015-06-02 07:58:42

---

Android 中估计最简单枯燥而且无意义的事情就是 findViewById 了，在我们真切期望 Google 爸爸亲自优化这一过程的同时，不少同学也亲自实践做出了一些好用的工具，在我用过的这些工具中，最强大的无疑就是 ButterKnife 了。

<!--more-->

ButterKnife 是 do one thing, and do it well 的典型，它的使用和大多数同类工具相同，通过注解、注入两步完成。然而程序员的懒是无止境的，所以有了这个：

![ButterKnifer Zelezny](/2015/06/02/ButterKnife/pic.gif)

使用 ButterKnife 步骤：

gradle 配置文件 dependencies 添加 

    compile 'com.jakewharton:butterknife:6.1.0'

Android Studio 插件安装，搜索 Android Butter Zelezny，安装，重启。

在 onCreate 方法的 setContentView 的 R.layout.xxx 上，Ctrl/Command + N，选择最下方 Generate Butterknife Injections，勾选（默认全选）需要绑定的 View，填写变量名（默认和 id 相同），选择是否创建 ViewHolder（默认否），confirm，一切就都做好了。

#end
title: 在Android Studio中删除Module
date: 2014-05-14 18:20:20
tags: [Android Studio, Android]
---
先前在项目设置中选择 Module 之后上面的减号不见了，所以原来删除 Module 的方法不再适用。

现在版本想要删除一个 Module（应该是0.5.2以后的版本），需要先在项目根目录下 setting.gradle 中删除所要删除 Module 的名称，然后点击工具栏上 Sync Project with Gradle Files 按钮，完成后右击所要删除的 Module 的文件夹就会发现原来不在的 Delete 键出现了，然后点击删除即可
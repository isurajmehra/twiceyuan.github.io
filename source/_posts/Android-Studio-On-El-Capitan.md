title: Android Studio 升级 El Capitan 之后的两个问题
date: 2015-11-03 11:18:52
tags: [Android Studio, Android, macOS]

---

升级 OS X 11 （El Capitan）后 Android Studio 遇到了两个麻烦的问题，在这里记一下。

## 1. 升级之后字体发虚

这个主要是低分屏下看起来很不舒服，同事的高分屏就没有这个。字体发虚是 JDK 的问题，因为 Jetbrains 全家桶都是基于 Java 开发的，所以把 JDK 的这一不良特性也带了进来，下载直接去苹果官网即可：https://support.apple.com/kb/DL1572

不过也不急解决这个问题，因为下面这个问题可以一起解决

## 2. 外接显示器+全屏模式会导致一定几率崩溃

这个问题是最让人蛋疼的。因为自己平时习惯两个显示器低头看文档抬头写代码，升级之后莫名其妙就会有一定几率崩溃，而且是随机的完全摸不清头脑，在 V2EX 上连发两个问题也没能得到满意的解决方案（不过第一个问题是很快就有人告诉我是 JDK 的问题，还是十分感谢 V2EX 的）。直到今天 IDEA 15 发布了正式版，下载之后发现切换屏幕焦点之后不像我电脑上装的其他 Jetbrains 产品那样闪屏，仔细看了一下它安装包自带了一个 JDK。所以就尝试了把这个 JDK 放到了 Android Studio 下，果然不出所料，Android Studio 也不闪屏了，而且多显示器全屏的问题似乎也解决了。IDEA 15 下载地址：https://www.jetbrains.com/idea/download/ 社区版就可以了，然后从 `.app` 文件下把 jre 这个文件夹复制到 Android Studio 的对应目录即可。

更令人高兴的是，用 Intellij 提供的 JDK 同样也可以解决第一个问题。
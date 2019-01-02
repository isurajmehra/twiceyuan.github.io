title: 多版本 Android Studio 共存[译]
date: 2016-01-24 14:13:54
tags: [Android Studio]

---

现在同时安装多个版本的 Android Studio 已经成为可能。当我们提供 Canary 版本（或者 Beta 版本）的下一版本 IDE 时，你也许想安装这个新版本但并不想替换掉你原有的稳定版。

<!-- more -->

Android Studio 在一个特殊文件夹保存它的设置；这个实际位置取决于操作系统（和 IDE 的版本），比如，如果你同时安装了 Android Studio 1.5.1 和 Android Studio 2.0 Preivew1，它们将各自读取位于

    ~/.AndroidStudio1.5

和

    ~/.AndroidStudioPreview2.0

的配置.

所以，一旦你安装了这两个版本，你可以直接使用它们，甚至是一起使用，并且它们不会互相冲突。（注意：新版本也许会改变你项目中的配置数据，比如在 .idea 中的 code style）

注意在 OS X，你通常从 dmg 文件夹中拖拽 Android Studio 的 app 进行安装。这样做会在新版本安装的同时替换掉前一个版本。想要避免这个问题，请先重命名已有版本的 app，比如把 「Android Studio」改为「Android Studio 1.5」

**删除旧的设置文件夹**

一旦你用的旧版本迁移完成后，你可以删除这个版本的设置文件夹。它可以腾出大量的磁盘空间，尤其是索引缓存。

* 视频：https://www.youtube.com/watch?v=SBbWGxXCMqQ
* 原文：http://tools.android.com/tips/using-multiple-android-studio-versions
title: Android应用证书签名
tags:
  - Android
  - Android Studio
date: 2015-05-11 08:28:11
---

在 Android Studio 上给应用签名很简单，首先在菜单中选择 Generate Signed APK，然后会有一个向导，如果之前有证书则需要填写证书路径和密码，如果没有的话可以根据向导创建一个，然后一直 next 直到 finish 就好了。

不过说下遇到的一些小问题：

1.  之前用 debug 证书签名的应用，如果需要安装 release 版本的应用，有时候在卸载本地应用后仍然安装不上新的应用，这时可以使用 `adb uninstall PACKAGE_NAME` 完整卸载掉应用。
2.  在应用存在是 adb install 可能会安装不上版本升级后的应用。这时需要使用 adb install -r 命令即可。

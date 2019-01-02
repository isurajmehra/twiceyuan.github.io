title: 在 Mac中离线升级 Android Studio
date: 2013-09-27 10:10:27
tags: [Mac, Android Studio, Android, macOS]

---

Android Studio 在线升级一直是个蛋疼问题，挂代理速度比较慢而且不稳定，但是所有蛋疼的在线升级问题都可以用一个方法解决——离线升级包。Mac 用离线升级包和Windows上基本相同只不过路径和资源的url不一样。

1. 从http://dl.google.com/android/studio/patches/updates.xml 找最新版本号如 0.2.10 （Build number: 132.843336）

2. 下载补丁 查找到版本号之后，直接从，http://dl.google.com/android/studio/patches/AI-[旧的版本号]-[新的版本号]-patch-mac.jar 例如从 130.737825 升级到 132.843336 就要下载 http://dl.google.com/android/studio/patches/AI-130.737825-132.843336-patch-mac.jar

3. 下载之后可以把jar文件拷贝到 /Applications/Android Studio/ 然后终端进入到 Android Studio 目录终端输入 

	<code>java -classpath XXXX.jar com.intellij.updater.Runner install .</code> (. 不可忽略，代表当前目录)
	
	然后会弹出一个升级框，即可完成升级。完成后即可删除jar文件

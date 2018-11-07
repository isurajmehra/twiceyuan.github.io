title: Travis 上接受 SDK License
date: 2018-11-07 10:02:28
tags: [Android, CI]

---

在 Travis 上构建项目时有时会遇到自己设备构建成功了，却在 Travis 上提示某个 component 安装失败，需要接受其对应的 license。在失败时其实已经给出一个地址说明了解决方法：https://developer.android.com/studio/intro/update#download-with-gradle

<!--more-->

简单来说就是把自己设备上的 license 允许后生成的文件拷贝到对应的 CI 机器。其实这个文件就是一个 license 的哈希值，所以直接用 echo 重定向到对应位置的文件就可以了。可以利用 before_script 来完成这部分的工作，首先查看自己设备上的 license 哈希值。

```
$ cat $ANDROID_HOME/licenses/android-sdk-license

d56f5187479451eabf01fb78af6dfcb131a6481e
8933bad161af4178b1185d1a37fbf41ea5269c55%
```

我修改后完整的配置为：

```
before_install:
 - yes | sdkmanager "platforms;android-28"
 - mkdir -p "$ANDROID_HOME/licenses"
 - echo -e "\nd56f5187479451eabf01fb78af6dfcb131a6481e\n8933bad161af4178b1185d1a37fbf41ea5269c55" > "$ANDROID_HOME/licenses/android-sdk-license"
 - chmod +x gradlew
```

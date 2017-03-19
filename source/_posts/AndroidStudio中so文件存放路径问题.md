title: AndroidStudio中so文件存放路径问题
date: 2014-08-04 00:52:35
tags: [Android Studio, Android]
---
最近要做一个关于地图导航的模块，用到了百度地图的 API，在 Hello World 的时候就出问题了：

文档中要求 so 文件放在 libs/armeabi/ 下，这样做之后编译通过，运行时报错：

```
java.lang.UnsatisfiedLinkError: Couldn't load BaiduMapSDK_v3_0_0 from loader dalvik.system.PathClassLoader[DexPathList[[zip file "/data/app/com.twiceyuan.baidumaptest-1.apk"],nativeLibraryDirectories=[/data/app-lib/com.twiceyuan.baidumaptest-1, /vendor/lib, /system/lib]]]: findLibrary returned null
```

查了一下，原来是 so 文件存放路径问题，Android Studio 下 so 文件的存放路径为：`src/main/jniLibs/armeabi/`

之后运行成功了。

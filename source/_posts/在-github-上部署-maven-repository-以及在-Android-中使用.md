title: 在 github 上部署 maven repository 以及在 Android 中使用
tags:
  - Android
  - Android Studio
date: 2015-05-07 07:24:42
---

以 volley 为例。

首先进入项目目录，执行命令：

```Shell
mvn install:install-file -DgroupId=com.android -DartifactId=volley -Dversion=1.0 -Dfile=build/outputs/aar/volley-release.aar -Dpackaging=aar -DgeneratePom=true -DlocalRepositoryPath=repository -DcreateChecksum=true
```

<!--more-->

-DgroupId 选项填写应用包名
-Dversion 版本号
-Dfile aar文件的路径
-Dpackaging 发布格式
-DgeneratePom 是否生成 POM
-DlocalRepositoryPath 本地库路径
-DcreateChecksum 检查 MD5检验值

部署到 github

调用的时候在项目的 gradle 文件中加上下面代码就可以了

```Java
repositories {
    maven { url 'https://raw.githubusercontent.com/twiceyuan/volley/master/repository' }
}
dependencies {
    compile 'com.android:volley:1.0'
}
```
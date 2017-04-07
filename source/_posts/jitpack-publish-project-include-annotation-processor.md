title: JitPack 发布包含 Annotation Processor 的项目
date: 2017-03-24 16:14:24
tags: [Android]

---
普通的项目（单个 Library Module）发布到 JitPack，体验不错几乎是零配置的。尝试了一下直接构建了一下一个包含两个 module 的项目——一个 Android Library Module 和一个纯 Java Module 的时候，JitPack 只构建了 Java 的 Module。
<!-- more -->
想起之前使用 Travis 和 GitLab Pipeline 的经历，猜测这种情况需要某些配置才行。看了下官方文档果不其然，确实有针对 Android 项目的配置（https://github.com/jitpack/jitpack.io/blob/master/ANDROID.md ），其实是 3.0 以上的 gradle 才需要的，可能暂时没有适配：

项目根目录 build.gradle:

```groovy
buildscript {
  dependencies {
    classpath 'com.github.dcendents:android-maven-gradle-plugin:1.5' // 加上这行
  }
}
```
library/build.gradle 添加:
```
apply plugin: 'com.github.dcendents.android-maven'  
group='com.github.YourUsername'
```
然后创建 release tag 或者根据 commit hash 开始构建就可以了

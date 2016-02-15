title: 如何将 Intellij 项目迁移到 Gradle 项目
date: 2013-09-30 16:35:23
tags: [Android Studio, Android]
---

> _本文来自 Google 官方文档，原文请点击 http://tools.android.com/tech-docs/new-build-system/migrating-from-intellij-projects_

> _(本人英语和专业水平非常有限，如果有比较严重的错误，请给予指正，谢谢)_

我们未来可能在 Android Studio 中添加一个自动迁移选项。

<!--more-->

而现在，如果要迁移一个 Intellij 项目到一个Android Gradle 项目（可以导入 Intellij 和支持直接在 Intellij 打开），可以遵循以下步骤：

* 创建一个基本的「build.gradle文件」。这个文件并不像在 Android Studio 中创建项目时创建的默认 Gradle 文件，这个 gradle 文件将指向你原有的源代码文件夹（如 /res/, src/）,而不是 Gradle 项目中新的目录结构（src/main/java，/src/main/res 等等）。文章下面给出一个示例 Gradle 文件。

* 确认你正在使用的库项目（比如 ActionBarSherlock），在 Gradle 中，你将不在需要在这些库中添加源代码项目。你可以简单的指出他们的依赖，然后系统将生成剩下的部分，下载、迁移在资源和 Manifest 中的条目等。对于每个库，查找相对应的 AAR 库依赖的名称（提供问题库已经作为一个 Android 库更新），并添加这些依赖性节。

  * 要找到合适的声明库列表，你可以能发现[这个](http://gradleplease.appspot.com/)很有用。

  
  
* 通过运行 gradle assembleDebug 在项目测试你的编译。如果你Gradle之前没有编译，它将从 http://www.gradle.org/downloads 安装。请注意，当你创建新的项目，我们创建一个 Studio 的 Gradle 包装器脚本（“gradlew”和“gradlew.bat”）在项目的根目录，所以任何项目中的用户都可以在您的项目中，运行“gradlew assembleDebug”等 Gradle 会自动下载安装。然而，现有的IntelliJ项目大概不会已经有 Gradle 的脚本。


* 注意的 IntelliJ 项目一般为 Android 的 Eclipse ADT 项目相同的结构，所以 Eclipse 的迁移指南中的说明可能会有帮助。

build.gradle:
```
    buildscript {
        repositories {
            mavenCentral()
        }
        dependencies {
            classpath 'com.android.tools.build:gradle:0.5.+'
        }
    }
    apply plugin: 'android'

        dependencies {
    compile fileTree(dir: 'libs', include: '*.jar')
    }

    android {
        compileSdkVersion 18
        buildToolsVersion "18.0.1"

        sourceSets {
            main {
                manifest.srcFile 'AndroidManifest.xml'
                java.srcDirs = ['src']
                resources.srcDirs = ['src']
                aidl.srcDirs = ['src']
                renderscript.srcDirs = ['src']
                res.srcDirs = ['res']
                assets.srcDirs = ['assets']
            }

            // Move the tests to tests/java, tests/res, etc...
            instrumentTest.setRoot('tests')

            // Move the build types to build-types/<type>
            // For instance, build-types/debug/java, build-types/debug/AndroidManifest.xml, ...
            // This moves them out of them default location under src/<type>/... which would
            // conflict with src/ being used by the main source set.
            // Adding new build types or product flavors should be accompanied
            // by a similar customization.
            debug.setRoot('build-types/debug')
            release.setRoot('build-types/release')
        }
    }
```
对于定制的建立，一旦你有基本设置的更多信息，请参阅新的构建系统的用户指南。有关其他信息，请参阅的构建系统概述页。
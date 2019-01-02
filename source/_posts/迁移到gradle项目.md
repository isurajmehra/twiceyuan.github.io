title: 如何将 Intellij 项目迁移到 Gradle 项目
date: 2013-09-30 16:35:23
tags: [Android Studio, Android]

---

> _本文来自 Google 官方文档，原文请点击 http://tools.android.com/tech-docs/new-build-system/migrating-from-intellij-projects_

我们未来可能在 Android Studio 中添加一个自动迁移选项。而现在，如果要迁移一个 Intellij 项目到一个Android Gradle 项目（可以导入 Intellij 和支持直接在 Intellij 打开的），可以遵循以下步骤：

<!--more-->

* 创建一个基本的「build.gradle」文件。这个文件并不像在 Android Studio 中创建项目时创建的默认 Gradle 文件，这个 gradle 文件将指向你原有的源代码文件夹（如 res/, src/）,而不是 Gradle 项目中新的目录结构（src/main/java，/src/main/res 等等）。文章下面给出一个示例 Gradle 文件。
* 确认你正在使用的库项目（比如 ActionBarSherlock），在 Gradle 中，你将不再需要在以源码的方式添加这些库到项目中。你可以简单的指出他们的依赖，然后系统将生成剩下的部分，下载、合并在资源和 Manifest 中的部分。对于每个库，查找相对应的 AAR 库依赖的名称（所提供的库已经被上传作为一个 Android Library Artifact），然后添加它们到依赖项中。
* 要找到合适的声明库列表，你可能发现[这个](http://gradleplease.appspot.com/)很有用。
* 通过在项目中运行 `gradle assembleDebug` 测试编译。如果你之前 Gradle 没有进行过编译，它将从 http://www.gradle.org/downloads 安装。请注意，当你在 Android Studio 中创建新的项目时，我们会在项目的根目录创建 Gradle Wrapper 脚本（“gradlew”和“gradlew.bat”），所以任何项目中的用户都可以在您的项目中，运行“gradlew assembleDebug”等 Gradle 会自动下载安装。而已存在的 IntelliJ 项目大概不会已有 Gradle 的脚本。
* 注意的 IntelliJ 创建的 Android 项目一般和 Eclipse ADT 项目保持相同的结构，所以 Eclipse 的迁移指南中的说明可能也会有帮助。

build.gradle:
```groovy
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

在进行过一次基础配置之后，需要获得关于这个构建系统的更多信息可以查看它的[用户指南](http://tools.android.com/tech-docs/new-build-system/user-guide)。想要获得更多信息，可以查看构建系统的[概览页](http://tools.android.com/tech-docs/new-build-system)。

> PS：本文在 2016年进行过一次更新，虽然迁移功能早已如 Google 承诺已经作为 Android Studio 的一个功能实现，但如果想要知道如何保持自己的目录结构来构建 Android 项目(有时这是有必要的，例如团队中有使用不同集成开发环境的同事)，本文仍然有参考价值。
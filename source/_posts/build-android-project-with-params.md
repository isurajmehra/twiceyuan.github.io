title: Android 项目的 Jenkins 参数化构建
date: 2016-11-02 15:20:56
tags: [Android, jenkins]

---
### 需求描述

项目分为三种类型构建：

1. 测试环境构建 debug
2. 测试环境构建后上传内测平台 (fir.im)
3. 发布版构建 release

三种构建类型在完成后都保存构建输出的 apk，只有在类型 2 完成后执行上传到内测平台操作

<!--more-->

### 当前环境

在配置参数化之前，已经具有基础的 jenkins 构建环境，jenkins 只支持一种类型的构建，每次需要构建不同类型的版本需要手动去改动的 invoke gradle script 中的 tasks 来实现。上传 fir.im 使用了 fir.im 官方提供的插件，在构建完成后直接上传对应目录的 apk 文件，如果不需要上传需要手动删除该步骤。

### 进行的改动

打开 jenkins 中需要改动的项目的「配置」界面。

#### jenkins 中的配置

1. 勾选「General」中的「参数化构建」选项，添加参数，选择 Choice。然后在依次在 name，choices，description 中填写，参数名，可选的参数选项和该参数的说明。例如我这里添加的 name 为 build_type，choices 为 test, test_fir, release(每一行代表一种 build type)。
2. 删除掉「构建」中的「Invoke Gradle Script」，因为需要针对参数进行处理所以自带的调用 gradle 脚本不能满足需求，这里选择「Execute Shell」类型添加，并在 Command 中填写：
   ```bash
   echo "构建类型 $build_type"
   chmod +x gradlew
   case $build_type in
       test)
           ./gradlew clean assembleDebug
           ;;
       test_fir)
           ./gradlew clean assembleDebug
           ./gradlew app:publishApkDebug
           ;;
       release)
           ./gradlew clean assembleRelease
           ;;
       *)
           exit
           ;;
   esac
   ```
3. 删除构建完成后的 fir.im 上传。因为 fir.im 官方的插件也没有提供参数化构建的支持，所以这里改用官方提供的 gradle 构建插件，通过在 shell 中判断参数来决定是否调用上传脚本。

#### 项目中的配置

项目中的配置主要是配置 fir.im 的 gradle 插件，可以参考官方的说明 http://blog.fir.im/gradle/ 。这里也简单描述一下步骤

1. 项目级别 build.gradle 添加以下配置：
   ```gradle
   buildscript {
     repositories {
       // ...
       jcenter()
       // 添加fir maven源
       maven {
         url "http://maven.bughd.com/public"
       }
     }
     dependencies {
       classpath 'com.android.tools.build:gradle:2.2.0'
       //添加fir插件依赖
       classpath 'im.fir:gradle-fir-publisher:1.0.7'
     }
   }
   ```
2. 在 module 级别 build.gradle 添加如下配置：
   ```gradle
   apply plugin:'im.fir.plugin.gradle'// 必填
   
   fir {
     //必填 上传 fir.im apk 字段，否则无法上传 APP 到 fir.im
     apiToken '替换为你的 fir.im API_TOKEN'

     //可选 上传fir.im 中显示的changelog
     changeLog '替换为你的更新日志'
   }
   ```

### 使用参数进行构建

配置完成够，会发现 jenkins 项目视图下的「立即构建」编程为使用参数进行构建。点击后会让用户选择三种构建类型，这里选择 test_fir 就可以构建并且上传到 fir.im 了。其他两种类型则会构建后归档构建结果。定制其他类型的构建同理。

### 额外的尝试

使用 gradle 插件已经上传之后，定制化是方便了一些，但是相应的 changelog 这个参数不太好传入了，因为是在 gralde 配置中的固定字符串。因为需要在上传的时候标记这个包是线上环境还是测试环境，所以为了定制这个 changelog 又进行了以下尝试：

1. 使用 gradle.properties。
   
   在 module 的 gradle 配置中，fir 的 changeLog 使用一个变量来表示：
   ```gradle
   changeLog "$change_log_string"
   ```
   之后在 jenkins 执行 gradlew 之前，通过追加的方式把这个变量添加到配置文件中：
   ```bash
   echo '\nchange_log_string=测试环境\n' >> gradle.properties
   ```
   之后发现一个比较头疼的问题：gradle.properties 中定义的配置中文会乱码，尝试修改了很多地方的配置，最后在本地测试也是同样乱码，通过搜索知道可能需要对 unicode 字符进行 encode 之后才行，觉得这样影响本身文本的可读性就放弃掉了
   
2. 动态追加 module 的 build.gradle。

   这种方法相比相面的，虽然不怎么优雅，但是简单粗暴而且不会乱码。方法通常简单，在需要上传 fir 的任务执行之前用追加上 fir 的配置：
   
   ```bash
   export FIR_TOKEN="这里放你的 token"
   export CHANGE_LOG="测试还是线上环境"
   echo '\n' >> app/build.gradle
   echo 'fir {\n' >> app/build.gradle
   echo "apiToken '$FIR_TOKEN'\n" >> app/build.gradle
   echo "changeLog '$CHANGE_LOG'\n" >> app/build.gradle
   echo '}\n' >> app/build.gradle
   ```
   
   相应的，在项目的配置里就不需要配置 fir 的 dsl 了，否则也会造成错误

title: 使用 nexus 搭建 maven 私有仓库和 gradle maven 插件的配置
date: 2016-10-29 11:50:51
tags: [Android, Maven, gradle]

---
现在在 Android 开发特别是 Android Studio 普及依赖之后，gradle 是日常需要使用的必不可少的工具之一，使用 gradle 构建 Android 项目时一个重要的功能就是管理项目的依赖。<!-- more -->在 gradle 中配置依赖是十分方便的，一般只需要配置一个仓库的地址，例如：

```groovy
repositories {
  maven { url "http://path/to/repo/" }
}
```

然后再根据需要依赖模块的 group + module + 版本号 就可以指定需要依赖的模块了。例如：

```groovy
dependenices {
  compile "groupName:moduleName:versionName"
}
```

这是平常使用 gradle 进行管理依赖的方法，如何搭建一个可以像上述配置可以使用的依赖呢？上面这种配置方式其实使用的是 maven 仓库，所以按照配置 maven 仓库的方式配置就可以了。Nexus(不是 Google 亲儿子) Repository Manager 是一个专门用来搭建的私有仓库和 Maven 镜像界面的仓库管理系统，有免费版 OSS 可以使用(地址：https://www.sonatype.com/download-oss-sonatype )，官方下载解压后就可以直接运行 `bin/nexus start` 启动，官方也提供了 Docker 镜像来创建容器使用，依赖也比较少所以搭建相对简单，这里不再对此说明。

默认的 nexus 管理权限设置是非常不安全的，如果需要在公网中访问，建议在配置完成后首先进行如下设置：

1. 修改 admin 密码，默认密码过于简单
2. 禁用 anonymous 账户
3. 创建可读的账户和可部署的账户(或者角色Role)

以上设置都在 Administration - Security 菜单下。配置可读账户和可部署账户时，是通过给 Role 分配 Privileges 来实现的，Privileges 里定义了对各个仓库的可读、可写、可删除的权限，我们简单实用的话只分配对 maven release 仓库的权限就可以了。

之后就是在 Android Studio(gradle) 中的配置。

首先给需要上传 nexus 的 module 添加 maven 插件，官方提供了可以直接引用，在 module 的 build.gradle 上添加：

```groovy
apply plugin: 'maven'
```

之后在最下面添加(其实位置随意)：
```groovy
uploadArchives {
    repositories.mavenDeployer {
        repository(url: REPO_URL) { // 仓库地址
            // 这里配置上传账户的用户名和密码
            authentication(userName: REPO_USERNAME, password: REPO_PASSWORD)
        }
        pom.version = VERSION_NAME
        pom.groupId = GROUP_ID
        pom.artifactId = MODULE_ID
    }
}
```

以上就是可以使用的最少配置，还有一些比如配置 license 可以在官方文档里查找属性说明。上面配置中的全大写的部分都是配置中定义的常量，推荐使用这种方式来保存这些配置。

另外，方便自己在引用时查阅源码而不是看反编译的代码，可以在打包过程中添加 javadoc 的 jar 文件和 source 的 jar 文件。这样在引用者查看所引用类库中的类时也能方便的查阅源代码和注释。

```groovy
task sourcesJar(type: Jar) {
    from android.sourceSets.main.java.srcDirs
    classifier = 'sources'
}
task javadoc(type: Javadoc) {
    failOnError  false
    source = android.sourceSets.main.java.sourceFiles
    classpath += project.files(android.getBootClasspath().join(File.pathSeparator))
    classpath += configurations.compile
}
task javadocJar(type: Jar, dependsOn: javadoc) {
    classifier = 'javadoc'
    from javadoc.destinationDir
}
artifacts {
    archives sourcesJar
    archives javadocJar
}
```

之后就可以在右侧边栏的 gradle tasks 里找到 uploadArchives 来上传 aar 到仓库了。

上传完成后可以在 nexus 中的 component 里看到上传的依赖了。因为我们私有仓库配置中禁用了匿名用户，所以直接引用时会报错找不到该依赖，所以在配置仓库地址时还需要添加上账户认证的信息：

```groovy
repositories {
    // other repo...
    maven {
        url REPO_URL
        credentials {
            username REPO_USERNAME
            password REPO_PASSWORD
        }
    }
}
```

以上就是配置的全过程，但是有一点遗憾，没有找到像 Google 的 Support Library 那样有版本更新时可以在 gradle 配置文件中提示的功能，查阅了很多资料也没找到对应的配置方法，希望有了解的朋友指教。
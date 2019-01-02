title: 搭建 jenkins 构建 Android 项目
tags: [Android,CI,Jenkins]
date: 2016-07-27 08:08:00

---
之前用过 Flow.ci、Travis 等公共的 CI 工具感觉很方便，但毕竟源码在别人那里多少有点别扭。Jenkins 是一个免费的高度可定制的 CI 开源项目，现在的公司使用它来构建 Android 项目，所以也来试一试，记录下搭建的过程以及遇到的问题，供自己和需要的人参考。

<!--more-->

### 安装 Docker

因为不喜欢直接装在本地环境（hard to uninstall），并且看到 Jenkins 提供了官方的 Docker 版本，于是选择了 Docker for Mac， 地址是 https://docs.docker.com/docker-for-mac/ 虽然还是 Beta 版，但是感觉比之前 vbox 版好用一些。

### 使用 Jenkins 官方的 Docker 镜像

安装好之后，可以执行 `docker` 命令查看环境是否被正确安装。正常情况下会输出 docker help。直接在 LaunchPad 中启动 Docker 的 App 后，就可以拉取官方的镜像了，在终端输入：

    docker pull jenkinsci/jenkins

然后创建并运行一个 container：

    docker run -p 8080:8080 -p 50000:50000 jenkins

之后会输出创建和初始化的日志，然后在 `localhost:8080` 即可打开网页进行初始化的一些配置、插件安装等。刚进入 Web 的时候，留意一下要用到一个密码，这个密码会在终端输出。

配置好 Ctrl-C 就可以停止掉这个 Container，之后启动和停止就可以使用 `docker start [container id]` 和 `docker stop [container id]` 来操作，查看 container id 使用 `docker ps -a`。后面需要进入到 container 中来配置某些东西时可以使用 `docker exec -i -t [container id] bash` 来进入到 container 的 shell 环境中，如果需要 root 身份则使用 `docker exec -i -t -u root` 。

### 安装 Plugins

包括 Gradle、Git 等常用的，有一些是必装的，如果你不清楚装哪些插件，可以先查一下或者直接安装官方默认推荐的插件。我是直接安装官方的，可以满足 Android 构建的需求。

### 配置 Android SDK

使用上面提到的方法进入 jenkins container 的 shell 中，下载 Google 官方的 Android SDK。因为 Docker 的系统层用了 ubuntu 所以选择 Linux 版的 SDK，使用 wget 下载。

```bash
# 下载
wget http://dl.google.com/android/android-sdk_[version name]-linux.tgz
# 解压
tar zxvf [下载后的文件]
# 删除压缩包
rm [下载后的文件]
# 运行非图形化界面，查看可下载的组件(和 UI 里查看并勾选的那个列表是相同的功能)
android list sdk --all
# 记下需要安装的组件编号(前面的数字)，执行下面的命令下载安装
android update sdk -u --all --filter <number>
```

主要需要的组件包括 Platform Tools, Build Tools, Android Support 库，我这边查到的编号是 7、30 和 143。



然后需要在 Jenkins 中配置 ANDROID_HOME 这个环境变量，指向你放置 SDK 的根目录



安装完之后，在构建时可能会遇到：[“aapt” IOException error=2, No such file or directory"](http://stackoverflow.com/questions/22701405/aapt-ioexception-error-2-no-such-file-or-directory-why-cant-i-build-my-grad) 还需要两个系统组件需要在 root 账户下使用 apt-get 安装，否则在使用 aapt 工具时会报错：

    apt-get install lib32stdc++6 lib32z1

### 创建项目

之后就可以创建一个 Android 项目来构建了。创建的过程资料就很多的，可以根据自己需要添加源码拉取的方法、构建的步骤、构建完的操作，定制化非常高。这边有时间再详细补充一下吧(可能永远没时间)


### 关于最佳实践


关于 docker 的使用，自己之前一直的一个误区就是把 docker 当成了 server 来用（其实主要是懒和对 docker 的使用不熟悉）。实际上 docker 实践中 container 是用完即弃的，所以像自己之前把 Android SDK 安装在 container 中劣势就比较明显了。正确的做法应该是通过 -v 参数把 Android SDK 映射到 docker 容器中的一个文件路径中，并且把 jenkins_home 也映射到一个物理路径。这样升级 jenkins 只需要修改 Dockerfile 的一个参数重新 run 出来一个 container 就可以了，Android 的 SDK 和 jenkins 的构建数据都能得以保留。后面再专门写一篇文章来记录下这个过程吧（填小坑挖大坑 🙄）。（更新于 2016-11-22）

### 参考资料

1. How To Build Android Apps with Jenkins https://www.digitalocean.com/community/tutorials/how-to-build-android-apps-with-jenkins
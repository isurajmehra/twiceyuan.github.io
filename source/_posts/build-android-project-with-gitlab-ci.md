title: GitLab CI 配置构建 Android 项目
date: 2017-07-10 11:17:48
tags: [Android, GitLab, CI]

---

## 标准步骤

1. 配置 GitLab Runner
2. 添加配置文件。.gitlab-ci.yaml 文件规则 https://docs.gitlab.com/ce/ci/yaml/

可以参考官方提供的文档来试试 https://about.gitlab.com/2016/11/30/setting-up-gitlab-ci-for-android-projects/

<!--more-->

## Android 实践中的改进

如果你真正把官方给出的配置拿来构建就会发现，虽然配置起来方便，配置文件也足够简洁，但是每次都需要安装一次 SDK。真实实践中最好保留 SDK 和 gradle 缓存以及编译缓存，这样可以开启增量编译和避免每次下载同样的东西，有助于持续化构建时减少单次的构建时间，。

### 使用 cache 保留每次构建缓存

使用 cache 的功能类似于 exclude 一个 volume，不过原理不同，根据日志推测 GitLab 是将指定的文件打包存储起来并在下一次释放而已。

```yaml
cache:
  key: ${CI_PROJECT_ID}
  paths:
  - .gradle/
  - build/
  - ${MODULE_NAME}/build/
  - ${ANDROID_HOME}/extras/
```

其中 CI_PROJECT_ID 是以项目 ID 作为键存储，因为 Runner 可能是多个项目共用的，而多个项目在该需求想不能共享构建的缓存，所以要以项目 ID 分别存储缓存。

### 使用 artifacts 保留每次构建结果

和 Jenkins 中的 artifacts 功能一致，都是用来保存构建结果用的，指定对应的目录即可。在 Android 中输出目录是比较深的，可以在 script 中转移到浅层目录对于输出文件展示来说可能更直观一些。例如：

```
  script:
  - mkdir -p apk
  - rm -rf app/build/outputs/apk/
  - ./gradlew sample:assembleRelease
  - cp sample/build/outputs/apk/*.apk apk/
  artifacts:
    paths:
    - apk/*.apk
```

### 使用定制的 docker 镜像进行构建

定制的镜像下载通常所需的 SDK 组件，这样构建项目时就不需要临时下载了。这里我使用的是别人分享的一个 Dockerfile，项目地址是：https://github.com/jangrewe/gitlab-ci-android 。作者把需要下载的依赖包放到一个 txt 文件中，你可以根据需要修改经常使用的 SDK 以及依赖版本编译自己的 image。这里和 jenkins 中使用有所不同，一旦你需要升级 SDK 版本或者依赖版本，就要重新编译一个新的镜像。

### 修改镜像拉取策略

修改配置文件：`/etc/gitlab-runner/config.toml` 在对应 runner 节点下添加 `pull_policy = "if-not-present"` 就可以了。例如：

```
[[runners]]
  name = "Android Build Runner"
  url = "https://rasp.xyz/git/"
  token = "3dc54666cacafdd6efad73cb73fc3e"
  executor = "docker"
  [runners.docker]
    tls_verify = false
    image = "alpine:latest"
    privileged = false
    disable_cache = false
    volumes = ["/cache"]
    shm_size = 0
    // 加入这行
    pull_policy = "if-not-present"
  [runners.cache]
```

默认的 GitLab Runner 是直接网络拉取镜像的。需要到配置文件中将策略改为先判断本地是否存在，本地不存在再从服务器拉取（pull）。

### 其他

构建的触发条件如果没有配置的话，默认是任何分支的提交、合并以及 tag 的创建都会触发构建。这显然是有些浪费的。我目前的策略是仅主分支发生变动才会构建。只需要在配置的 job 节点下添加 only 值即可：

```yaml
// Job 名称
Build Release Version:
  // 只在主分支发生变动时构建
  only:
  - master
```

这样我一般开发时就是用 develop 分支，开发完毕没有问题了合并到主分支就会自动进行构建。不过 GitLab CI 默认情况下构建成功是没有邮件通知的(相比于 travis)，应该是可以配置的。我目前是用了 Telegram 的 REST Api 直接发送给我的 Telegram 账号通知，配置起来也十分方便。

## 总结

GitLab CI 总体来说还是比较好用的，虽然在易用性和生态上不如 Jenkins，但是实际使用时考虑到免不了一些自定义配置的话 jenkins 也很麻烦。目前使用的主要痛点在于构建的 docker 不能指定共享目录(volume)，导致 SDK 升级和自动下载不如 jenkins 方便。另外 Web UI 的可操作性也不如 Jenkins。刚刚这两点考虑到前者还可以接受，后者的话也决定减少使用 Web 来控制构建流程，所以还是准备在个人项目上迁移到 GitLab CI 的。GitLab 官方似乎也比较看重这个项目，希望生态能够越来越强大。

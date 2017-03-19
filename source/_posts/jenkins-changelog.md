title: Jenkins 获得本次构建的 git change log
date: 2017-02-21 04:32:29
tags: [Jenkins]

---
Jenkins 每次构建都会根据 git 的提交记录生成一个 web 页面来显示自上次构建之后的提交记录列表。在配置 CI 工作流时，很多情况需要获取这个提交记录的 String 值，但是 Jenkins 并没有提供这个功能。

<!--more-->

Jenkins 官方反馈中有人也提出了这一需求：https://issues.jenkins-ci.org/browse/JENKINS-12032 。下面有人给出了一个插件来解决，插件地址：https://github.com/daniel-beck/changelog-environment-plugin ，不过作者没有编译上传到 jenkins 的插件中心，也没有文档说明怎么使用，这里简单介绍一下。

首先项目拉到本地，在项目根目录执行 `mvn verify` 就可以编译生成我们需要的 hpi 插件文件了（编译需要很多依赖，第一次可能会比较漫长）。之后在 Jenkins 中管理插件的高级(Advanced)中，选择上传 hpi 文件，就可以安装成功了。你也可以直接下载我编译好的{% asset_link changelog-environment.hpi 点击下载 %}。

安装成功以后，在项目配置的 Build Environment 环节，会多出一个选项：Add Changelog Information to Environment。下面有三个编辑框，分别是：Entry Format、File Item Format 和 Date Format。第一个就是填写提交日志输出格式的地方，采用的是 Java String.format 占位符的形式。其中可以使用四个参数，分别是：

1. 提交的作者
2. 提交的 ID
3. 提交信息
4. 提交时间(通过 Date Format 控制格式)

例如，我在 Entry Format 输入 %3$s (at %4$s via %1$s)\\n，然后有一条在 2017-02-10 的提交记录，提交信息为「fix bug」，提交者为 twiceYuan，那么输出到环境变量的字符串就是 "fix bug (at 2017-02-10 via twiceYuan)\\n" (后面的 \\n 是为了多层转义，视使用情况请自行调整)，同样时间格式编辑框填写的是：yyyy-MM-dd。

通过设置之后，在构建时就可以通过 shell 中来获得 SCM_CHANGELOG 变量来取到更新日志了。比如自动上传更新信息到内测平台。


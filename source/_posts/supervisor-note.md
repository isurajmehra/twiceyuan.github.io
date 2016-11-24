title: 用 Supervisor 监听程序运行
date: 2016-11-24 21:53:38
tags: [Linux]

---

今天发现之前搭的 nexus maven manager 服务挂了，被要求解决挂了之后不能自动重启的问题。本来想写个 shell 糊弄一下，请教了一下公司的后端小哥得知了 supervisor。其实 supervisor 之前倒也「用」过，阴影中的袜子官方文档貌似就介绍过它的使用，查了一下文档发现用起来很方便，应该是此类问题的最佳实践了，这里稍微记录一下基本用法。

<!--more-->

### 安装

使用 python 实现的，所以使用 pip 或者系统默认的包管理工具都可以找得到，比如`pip install supervisor` 或者 `sudo apt-get install supervisor`。

### 配置

`supervisord -c /path/to/configure/file.conf` 可以直接根据配置文件来开启 supervisor，更方便的是使用 `supervisorctl` 。

使用 supervisorctl 会进入一个 shell 的交互界面，可以输入命令来完成启动，重启，查看状态等工作。比如 help。

哦对有 help，自己看 help 吧，本文介绍完毕。

title: MongoDB 学习笔记1 —— 配置与启动
date: 2014-10-01 19:25:22
tags: [MongoDB, 数据库]

---
_（环境：OS X Yosemite beta）_

先将官网下载的包解压，放入自定义位置。

这里我放置到用户目录的 Library 下，完整路径 `/Users/twiceyuan/Library/MongoDB/` 里面，并建立一个 lasted 文件夹链接到 MongoDB 的 HOME 文件夹，以便以后版本更新。
<!--more-->
###OS X 下添加到环境变量：

编辑 home 文件夹下 .bash_profile 文件，添加一下语句
`export PATH="/Users/twiceyuan/Library/MongoDB/lasted/bin/:$PATH"`

###前台启动服务：

`mongod --dbpath ~/Library/MongoDB/lasted/data/db/`

启动服务后即可看到运行日志来对数据库的运行进行监控

###后台启动服务

`mongod --dbpath ~/Library/MongoDB/lasted/data/db/ --fork --logpath ~/Library/MongoDB/lasted/data/log/mongodb.log`

后台启动需要添加 --fork 参数。同时需要通过--logpath 指定日志的输出文件

###Web 服务启动

如果想要在浏览器中使用图形界面来管理数据库，可以在启动命令后添加`--httpinterface`

###进入 MongoDB Shell：

在终端中输入
`mongo localhost:27017/admin`
后出现以下提示符则表示已经进入到 MongoDB 的 Shell 环境中了。

    MongoDB shell version: 2.6.4
    connecting to: localhost:27017/admin

###终止服务

如果是前台运行的话，在 OS X 的终端下直接 Control + C 就可以终止服务了。如果是后台启动，可以在 Shell 下输入 db.shutdownServer() 来终止
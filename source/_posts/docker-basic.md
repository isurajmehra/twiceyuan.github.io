title: "Docker 小试"
date: 2015-03-21 11:57:10
tags: [Docker]
toc: true

---

使用 Docker 照着别人教的把 oracle 装好了，但是对 docker 一些基本的用法还不熟悉，比如：我配置好一个 container，如何打包给别人直接用，如何如何查看 container 的状态等等。这里在网上以及官方文档中收集了一些常用的命令，供自己忘记时查阅使用。

{% asset_img docker.png %}

<!--more-->

首先安装不用说了，Docker提供了非常便捷傻瓜简单粗暴的安装方法，<del>这点和恶心的oracle大不相同<del>。

##docker pull

> docker pull: Pull an image or a repository from a Docker registry server
> 从 Docker 注册的服务器中拉取一个镜像或者库。

比如我上次安装时使用的 `wnameless/oracle-xe-11g` 就是一个别人做好的 image，通过这个命令可以拉取到本地。

##docker run

> docker run: Run a command in a new container
> 在一个新的容器中运行一个命令

在进行 `docker pull wnameless/oracle-xe-11g`之后，就可以运行如下命令来启动这个镜像，并作为一个container运行：

    docker run -d -p 49160:22 -p 49161:1521 wnameless/oracle-xe-11g

* `-d` 选项代表 Enable daemon mode，启动后台驻留模式
* `-p` 进行端口映射。这里把 container 的端口22映射到 docker 的49160，把 1521 映射到 49161
* `wnameless/oracle-xe-11g` 该镜像的名字

##docker start/stop/restart

运行完 docker run 之后，可以看到 docker ps -a 中就多了一个容器。通过 stop/start/restart 可以停止启动重启该容器。

##docker ps

    docker ps -a
    
通过此命令可以查看所有 docker container 的运行状态，包括 6 列信息：

列名				|含义
---------------	|--------------
CONTAINER ID	|容器id
IMAGE 			|镜像
COMMAND 		|运行的命令
CREATED			|创建时间
STATUS			|状态
PORTS			|端口
NAMES			|名字

##docker images

查看所有 image

`-a` 显示所有 image（默认只显示中间层）

##docker save/load

Save an image to a tar archive/Load an image from a tar archive

保存一个镜像到 tar 归档文件/从一个 tar 归档中加载一个镜像

##docker commit

docker commit [OPTIONS] CONTAINER [REPOSITORY[:TAG]]

Create a new image from a container's changes

根据一个 container 的变化创建一个新的 image

`-a, --author=""`     Author (e.g., "John Hannibal Smith <hannibal@a-team.com>")
  
`--help=false`        Print usage

`-m, --message=""`    Commit message

`-p, --pause=true`    Pause container during commit


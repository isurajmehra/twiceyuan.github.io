title: "在 Docker 上配置 Oracle"
date: 2015-03-20 16:07:19
tags: [Docker, oracle]
toc: true

---

上一篇说了自己多么智商捉急以至于一个 oracle 装了一下午。所以趁此机会赶时髦学习一下 Docker 的使用。

{% asset_img docker.png %}

<!--more-->

##安装 Docker

###1. Ubuntu

第一次尝试选择的是 Ubuntu，官方源中已经有了 Docker，所以直接使用系统包管理安装就可以了：`sudo apt-get install docker.io`

###2. OS X

尝试Ubuntu成功后，为了更加减轻宿主机的负担，又尝试了在OS X上安装。官方提供了Boot2Docker 的安装包，直接安装就好了。

Boot2Docker运行原理是在VirtualBox建立一个轻量级的VM（冷启动大概也就四五秒的样子），所以要比虚拟机开个Ubuntu要轻的多。安装之后，可以通过运行 App 里的Boot2Docker 进入 Docker 的Shell，也可以通过 boot2docker ssh 进入。另外在宿主机中连接 Docker 中的 Container 需要使用 Docker 的 IP。这个 IP 在 使用 boot2docker 启动的时候可以看到，或者通过 boot2docker ip 来查看。

##<del>下载别人装配好的 Dockerfile

更正：这一步和下面一步 docker pull 没有关系。下面的docker pull命令是从docker的类似包管理的官方源服务器上拉取的，而不是本地，所以需要良好的网络环境。如果需要根据本地Dockerfile来创建容器，可以使用`docker build`命令。<del>

地址：https://github.com/wnameless/docker-oracle-xe-11g 。<del>直接 git clone 到本地就行了<del>

##安装

docker shell 下：

    docker pull wnameless/oracle-xe-11g

运行，并开放 49160 和 49161 端口，分别对应 22 端口和 oracle 端口（SSH 和 oracle 数据库）

    docker run -d -p 49160:22 -p 49161:1521 wnameless/oracle-xe-11g

数据库信息如下：

    hostname: localhost
    port: 49161
    sid: xe
    username: system
    password: oracle
    
SYSTEM和SYS的初始密码都为 `oracle`

Container SSH 的 root 密码为`admin`。

需要说明的是，在 OS X 上通过 SSH 连接 docker container 使用的是 docker 的 ip 而不是 localhost。

安装完毕之后，就可以通过客户端配置上述数据库信息来连接数据库了。图为 OS X 下 SQL Developer 连接 Docker 中数据库的配置界面。

{% asset_img oracle_config.png %}
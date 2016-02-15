title: "连接 Docker Container 的几种方式"
date: 2015-03-21 21:44:10
tags: [Docker]
toc: true

---

经过熟悉之后，在 docker 里安装了一个 ubuntu 准备学习使用。然后遇到了一些问题：

<!--more-->

使用 docker run -d ubuntu 之后，container在运行之后马上退出了。

原因很简单，在docker run 之后没有命令参数，添加 bash 就可以了：
   
    docker run -d ubuntu /bin/bash
   
运行是运行了，在 docker pa -a 中也可以看到 container 跑的正欢快，问题来了：怎么和它交流？发现官方版 ubuntu 是不像之前装的 oracle 一样自动开启 ssh 的（经过观察这部分是写在之前 Dockerfile 里的），但是想要进入 container 自己还只会使用 ssh。所以我尝试了 docker attach [container id]。成功了，但是也有缺点，在我退出 shell 的时候，该 container 也被关闭了。这肯定不是官方优雅的姿势。

##使用 nsenter 进入 container

经过 google 发现了[这篇文章](https://github.com/ma6174/blog/issues/8)。里面介绍最推荐的是使用 nsenter，这里照抄下安装方式：

这个程序的安装方式很独特，使用docker进行安装：

{% codeblock lang:shell %}
$ docker run --rm -v /usr/local/bin:/target jpetazzo/nsenter
{% endcodeblock %}

使用方法也很简单，首先你要进入的container的PID：

{% codeblock lang:shell %}
$ PID=$(docker inspect --format {% raw %}{{.State.Pid}} {% endraw %}<container_name_or_ID>)
{% endcodeblock %}

然后就可以用这个命令进入container了：

{% codeblock lang:shell %}
$ nsenter --target $PID --mount --uts --ipc --net --pid
{% endcodeblock %}

为了使用方便可以写一个脚本自动完成：

{% codeblock lang:shell %}
$ cat /bin/docker_enter
#!/bin/bash
sudo nsenter --target `docker inspect --format {% raw %}{{.State.Pid}}{% endraw %} $1` --mount --uts --ipc --net --pid bash
{% endcodeblock %}

这样每次要进入某个 container 只需要执行`docker_enter <container_name_or_ID>`就可以了。

##使用 boot2docker需要注意的

在安装之后，发现重启 docker 之后命令就失效了。在 nsenter 官方 github 中找到解答：

> If you are using boot2docker, you can use the function below, to:

> install nsenter and docker-enter into boot2docker's /var/lib/boot2docker/ directory, so they survive restarts.

> execute docker-enter inside of boot2docker combined with ssh
> {% codeblock lang:shell %}
>     docker-enter() {
>       boot2docker ssh '[ -f /var/lib/boot2docker/nsenter ] || docker run --rm -v /var/lib/boot2docker/:/target jpetazzo/nsenter'
>       boot2docker ssh -t sudo /var/lib/boot2docker/docker-enter "$@"
>     }
> {% endcodeblock %}
    
You can use it directly from your host (OS X/Windows), no need to ssh into boot2docker.

我并不希望使用 ssh 来连接 docker 所以只需要将前面安装命令中的路径修改为 `/var/lib/boot2docker/`就可以了
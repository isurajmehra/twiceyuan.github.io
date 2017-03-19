title: 借助 Docker 使用 Hexo
tags:
  - Hexo
  - Docker
date: 2017-02-11 14:17:04
---
去歧义：本文讲述的是

本来想命名为：在 Docker 中使用 Hexo，想想还是有区别的：一个是完全把 Hexo 博客 host 在一个 docker 容器里(顶多把 site 的目录映射到外部来)，一个是仅仅把 Docker 作为替代宿主机安装 Node 以及 Hexo 环境的隔离环境。这样本机就可以不用安装 node 以及 hexo 相关的环境，如果你有在多台机器上使用 Hexo 的需求，那么使用 Docker 来代替本地安装是个不错的选择。

<!--more-->

Dockerfile 已经上传到 DockerHub，直接在 .zshrc 中添加两个 alias 即可。

```bash
alias docker-hexo='docker run --rm \
-e USER_NAME=twiceYuan \
-e USER_EMAIL=twiceyuan@gmail.com \
-v "$PWD:/blog" \
-v "/Users/twiceYuan/.ssh:/root/.ssh" \
-p 4000:4000 twiceyuan/hexo-cli'

alias hexo='docker-hexo hexo'
```

其中，替换掉 username 和 user email 两个变量，替换掉 .ssh 的路径就可以了。

使用时和在本地时一样。
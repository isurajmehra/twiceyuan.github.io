title: 借助 Docker 使用 Hexo
date: 2017-02-11 14:17:04
tags: [Hexo, Docker]

---
本来想命名为：在 Docker 中使用 Hexo，想想还是有区别的：一个是完全把 Hexo 博客 host 在一个 docker 容器里(顶多把 site 的目录映射到外部来)，一个是仅仅把 Docker 作为替代宿主机安装 Node 以及 Hexo 环境的隔离环境。这样本机就可以不用安装 node 以及 hexo 相关的环境，如果你有在多台机器上使用 Hexo 的需求，那么使用 Docker 来代替本地安装是个不错的选择。

<!--more-->

我这里用的是 pull 数量最多的 emitting/hexo。首先把镜像拉到本地：

    docker pull emitting/hexo

这时运行 `docker run emmiting/hexo hexo version` 就可以看到输出：

> hexo-cli: 1.0.2
> os: Linux 4.9.4-moby linux x64
> http_parser: 2.7.0
> node: 7.5.0
> v8: 5.4.500.48
> uv: 1.10.2
> zlib: 1.2.8
> ares: 1.10.1-DEV
> modules: 51
> openssl: 1.0.2k
> icu: 58.2
> unicode: 9.0
> cldr: 30.0.3
> tz: 2016j

之后需要做几件事情来保证能像本地命令一样使用 docker 中的 hexo：
1. 映射 SSH key 所在的文件夹
2. 映射当前目录为 docker 中的工作目录
3. 映射需要暴露的端口 4000
4. 设置 Git 的变量 user.email 和 user.name

把这几步统一定义为一个 alias：

    alias docker-hexo='docker run --rm -v "$PWD:/blog" -v "[用户目录]/.ssh:/root/.ssh" -p 4000:4000 emitting/hexo git config --global user.email "[你的邮箱]" && git config --global user.name "[你的用户名]" &&'

例如：

    alias docker-hexo='docker run --rm -v "$PWD:/blog" -v "/Users/twiceYuan/.ssh:/root/.ssh" -p 4000:4000 emitting/hexo     git config --global user.email "twiceyuan@gmail.com" && git config --global user.name "twiceYuan" &&'

然后定义一个可以直接使用的命令：

    alias hexod='docker-hexo hexo'

之后如果需要安装 node 组件，可以使用 `docker-hexo npm install [...]`

如果需要直接操作 hexo，就使用 hexod 操作，例如 `hexod server`。
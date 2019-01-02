title: 使用 yum 处理 oracle 环境依赖
tags: Oracle
date: 2015-03-27 08:01:35
---

 安装过 oracle 的都知道，在安装之前配置环境和处理依赖是件很繁琐的事情。在 oracle 自家系统上有较好的解决方案（可能不适用于其他发行版），就是使用 yum 来安装一个预安装包来处理依赖配置环境。

<a id="more"></a>

方法如下：

1.  `cd /etc/yum.repos.d/`
2.  `wget http://public-yum.oracle.com/public-yum-ol6.repo`
3.  将 `[ol6_u3_base]` 和 `[ol6_UEK_base]` 下的 enable 参数改为1
4.  `yum install oracle-rdbms-server-11gR2-preinstall`
5.  验证环境是否正确安装，然后就可以开始运行安装程序了

详细：[http://blog.csdn.net/leshami/article/details/26339933](http://blog.csdn.net/leshami/article/details/26339933)
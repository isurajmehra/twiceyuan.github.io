title: OS X（10.9及以上）中启动 Web 和 php 服务器
date: 2014-10-05 04:09:00
tags: [php, Mac, macOS]

---
拖了好几大月，php 终于要动工了，第一步当然是搭环境。然后 OS X 用户的一大福利是 php 环境系统已经集成了。记得刚买电脑时的 OS X 10.8 还可以在设置共享中直接开启 Web 服务器，貌似10.9之后就没有了，不过这个功能并不是被阉割了，可以使用以下方法来启动 OS X 预装的 Apache 服务器：

`sudo apachectl start`
<!--more-->
和 Linux 中一样，终止和重启服务器的命令如下：

`sudo apachectl stop`

`sudo apachectl restart`

之后便可以在浏览器里登录 localhost 或者 127.0.0.1 测试是否启动成功了 php 也是预装好的，通过修改 /etc/apache2/httpd:conf 来启用：找到

`#LoadModule php5_module libexec/apache2/libphp5.so`

将前面的`#`号去掉，然后重启 Apache 服务器就可以了。

然后再配置一下 DocumentRoot 目录，就可以用了。
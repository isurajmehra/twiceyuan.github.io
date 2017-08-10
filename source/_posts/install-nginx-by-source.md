title: 源码安装配置 Nginx 记录
date: 2017-06-15 15:23:51
tags: [DevOps]

---
debian 官方源中的 nginx 太旧了（1.6.x），想试试开启 HTTP2 和 TCP/UDP 负载均衡试试，需要 1.9 版本以上。换了 backports 的源一些相关模块总是安装不成功（←太菜），所以尝试了从源码安装，顺便体验一下最新的 nginx。

<!--more-->

#### 安装 Nginx 的依赖

* PCRE 库 – NGINX 核心模块和 Rewrite 模块需要，并且提供了正则表达式的支持：

    ```shell
    $ wget ftp://ftp.csx.cam.ac.uk/pub/software/programming/pcre/pcre-8.40.tar.gz
    $ tar -zxf pcre-8.40.tar.gz
    $ cd pcre-8.40
    $ ./configure
    $ make
    $ sudo make install
    ```

* zlib 库 – NGINX Gzip 模块用来 header 压缩的：

    ```shell
    $ wget http://zlib.net/zlib-1.2.11.tar.gz
    $ tar -zxf zlib-1.2.11.tar.gz
    $ cd zlib-1.2.11
    $ ./configure
    $ make
    $ sudo make install
    ```

* OpenSSL 库 – NGINX SSL 模块依赖，用来支持 HTTPS：

    ```shell
    $ wget http://www.openssl.org/source/openssl-1.0.2f.tar.gz
    $ tar -zxf openssl-1.0.2f.tar.gz
    $ cd openssl-1.0.2f
    $ ./configure darwin64-x86_64-cc --prefix=/usr
    $ make
    $ sudo make install
    ```

#### 下载源码

从这里找到需要下载的最新版：http://www.nginx.org/en/download.html

```shell
$ wget http://nginx.org/download/nginx-1.12.0.tar.gz
$ tar zxf nginx-1.12.0.tar.gz
$ cd nginx-1.12.0
```

基本配置：

```shell
$ ./configure
--with-pcre=../pcre-8.40
--with-zlib=../zlib-1.2.11
--with-http_ssl_module
--with-http_v2_module
--with-stream
```

编译安装：

```shell
$ make
$ sudo make install
```

运行（debian 下的默认路径）：

```shell
$ sudo /usr/local/nginx/sbin/nginx 
```

#### 配置到 systemd

添加文件`/lib/systemd/system/nginx.service`内容如下：

```shell
[Unit]
Description=The NGINX HTTP and reverse proxy server
After=syslog.target network.target remote-fs.target nss-lookup.target

[Service]
Type=forking
PIDFile=/usr/local/nginx/logs/nginx.pid
ExecStartPre=/usr/local/nginx/sbin/nginx -t
ExecStart=/usr/local/nginx/sbin/nginx
ExecReload=/bin/kill -s HUP $MAINPID
ExecStop=/bin/kill -s QUIT $MAINPID
PrivateTmp=true

[Install]
WantedBy=multi-user.target
```

刷新 systemd 服务：

```shell
systemctl daemon-reload
```

启用服务：

```shell
systemctl enable nginx
```

使用 systemd 启动 nginx：

```shell
systemctl start nginx
```

查看 nginx 服务状态：

```shell
systemctl status nginx
```

正常运行的状态如下：

```shell
● nginx.service - The NGINX HTTP and reverse proxy server
   Loaded: loaded (/lib/systemd/system/nginx.service; enabled)
   Active: active (running) since Thu 2017-06-15 14:55:09 CST; 16min ago
  Process: 9452 ExecStart=/usr/local/nginx/sbin/nginx (code=exited, status=0/SUCCESS)
  Process: 9449 ExecStartPre=/usr/local/nginx/sbin/nginx -t (code=exited, status=0/SUCCESS)
 Main PID: 9453 (nginx)
   CGroup: /system.slice/nginx.service
           ├─9453 nginx: master process /usr/local/nginx/sbin/nginx
           └─9454 nginx: worker process

Jun 15 14:55:09 rasp nginx[9449]: nginx: the configuration file /usr/local/nginx/conf/nginx.conf syntax is ok
Jun 15 14:55:09 rasp nginx[9449]: nginx: configuration file /usr/local/nginx/conf/nginx.conf test is successful
Jun 15 14:55:09 rasp systemd[1]: Started The NGINX HTTP and reverse proxy server.
```

#### HTTP2 配置

只需要 server 下的 listen 属性后添加 http2 即可：

```shell
...
server {
  listen 443 ssl http2;
...
```

#### TCP/UDP 负载均衡

其实这个对我没鸟用，本来希望像反代 HTTP 服务那样反代一个 MySQL 服务到一个二级域名，结果在 server 下配置 server_name 属性提示不合法。查了一下 nginx 配置域名代理的前提是 http 请求中携带了需要请求的域名信息 nginx 才能负责分发，而 TCP/UDP 的网络连接就不能使用这个特性了。

也把配置写下吧，不过单台机器上的作用和端口转发基本一样了，不是很有必要：

```shell
stream {
  upstream mysql {
    hash $remote_addr consistent;
    server 0.0.0.0:33060 max_fails=3 fail_timeout=30s;
  }
  server {
    listen 3306;
    proxy_connect_timeout 30s;
    proxy_timeout 600s;
    proxy_pass mysql;
  }
}
```

> 参考资料：https://www.nginx.com/resources/admin-guide/installing-nginx-open-source/


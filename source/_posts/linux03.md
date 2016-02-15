title: Linux中的硬链接和软链接（符号链接）
date: 2013-03-06 15:09:10
tags: [Linux,课堂笔记]

---
用touch在主目录创建一个名为sharefile的文件：touch sharefile
<!--more-->
在主目录中分别创建到sharefile的硬链接和符号连接，名称分别为sharefile_h,sharefile_s

用ls -il查看sharefile、sharefile_h、sharefile_s的属性，了解硬链接与符号链接的差别
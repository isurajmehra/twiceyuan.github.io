title: OS X 下实用 dd 工具制作 Linux 的启动盘
date: 2013-09-16 11:33:04
tags: [Mac, Linux, macOS]

---

以 Ubuntu 为例，转换 iso 文件为 dmg 文件

<code>hdiutil convert -format UDRW -o ubuntu-12.10-desktop-amd64.dmg ubuntu-12.10-desktop-amd64.iso</code> 

查看 U盘挂载位置

<code>diskutil list</code>
<!--more-->
卸载 U盘

<code>diskutil umountDisk /dev/disk1</code>

写入(据说 disk1前加 r 是可以加快写入速度)

<code>sudo dd if=ubuntu-12.10-desktop-amd64.dmg of=/dev/rdisk1 bs=1m</code>
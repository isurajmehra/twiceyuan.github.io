title: Android网络调试开启方法
date: 2014-11-21 19:09:01
tags: Android

---
最近卖了nexus 4换了nexus7(2013)玩，发现之前一直在CM上使用的网络调试在原生Android 5.0上并没有开启的选项，Google了一下，貌似原生的Android都没有。

不过Android本身还是提供这个功能，开启有两种方法：
<!-- more -->

1. 连接USB数据线

   打开usb调试，Terminal输入,

       adb tcpip 5555（端口号）    
       adb connect 192.168.1.199 （Android设备IP地址)
       adb usb 使用回usb调试

2. 无需数据线
   
   且可解决部分机器在方法1时出现的“unable to connect to 192.168.1.199:5555”错误

   在android设备上安装 “终端模拟器”等类似shell命令工具，使用下面命令（需root权限）：

   TCP/IP方式：

       setprop service.adb.tcp.port 5555
       stop adbd
       start adbd

   usb方式：

       setprop service.adb.tcp.port -1
       stop adbd
       start adbd

参考：[stackoverflow](http://stackoverflow.com/questions/2604727/how-can-i-connect-to-android-with-adb-over-tcp)


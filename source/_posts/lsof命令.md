title: lsof命令
date: 2014-05-11 18:25:38
tags: macOS

---
以前有从不关机的习惯的（qiang）时（po）候（zheng），总苦恼一件事，就是删除一些应用之后，清空废纸篓总是遇到无法清空正在运行的问题。

后来发现这个问题在终端下使用 remove 命令并没有。但感觉有些别扭（主要是没有刷一下的那个音效。。。）。今天发现了 lsof 这个命令，可以根据文件来查找正在使用这个文件的进程，然后就使用 kill 命令做掉它成功清空回收站了。

另外推荐使用的 Mac 的同学一本书：《MacTalk 人生元编程》，电子版多看上有售。

（注：[lsof](http://www.ibm.com/developerworks/cn/aix/library/au-lsof.html) = “list open files”（列出打开的文件））
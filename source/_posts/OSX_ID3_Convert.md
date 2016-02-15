title: 音乐 ID3 乱码修复工具
date: 2014-10-28 20:33:12
tags: [OS X, iTunes, Mac]
---
音乐导入进 iTunes 常会有ID3信息乱码，图形工具大多需要付费，介绍一个免费好用的 Java 编写的命令行工具 id3iconv，官方网站在[这儿](http://www.zhoufeng.net/eng/id3iconv/)可自行下载。

使用也非常简单，`java -jar id3iconv-0.2.1.jar [需要转换编码的 MP3文件].mp3` 就可以了。根据这个还可以直接一个批量转换的脚本，好久没碰 Shell 就不在这里写了。
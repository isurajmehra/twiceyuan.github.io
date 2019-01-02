title: macOS 文件系统的大小写敏感转换
date: 2018-12-11 17:03:54
tags: [macOS]

---

本文介绍如何通过命令转换一个大小写敏感的 macOS 文件系统到非敏感。

感谢 https://github.com/cr/MacCaseSensitiveConversion 提供的宝贵经验，本文主要复述原作者提供的方法。

前不久因为硬盘事故重装了系统，无意重装时无意选择了 Case Sensitive(大小写敏感) 的 APFS 进行格式化。直到昨天安装 Steam 时发现安装后运行不了，查了一下原来是因为之前选择文件系统大小写敏感的原因，然后搜索到了 GitHub 上前文提到的 repo，了解到还有一系列应用比如 Creative Cloud 不能运行，索性晚上按照其提供的方法转换了文件系统格式。总体步骤如下：

<!--more-->

1. 解决现有系统下所有因为大小写造成的命名冲突
2. 生成一个全新的 TimeMachine 备份
3. 修改该备份中的一个关于大小写敏感的变量
4. 从这个备份中进行恢复

## 解决问题之前的准备

尽量关闭磁盘加密，因为加密磁盘会极大的增加以下几个步骤的时间。

## 1. 解决命名冲突

可以借助上述 repo 中提供 `casecheck.py` 来检查现有系统中大小写不敏感时的文件冲突。这里的冲突是指例如 `appstore` 和 `AppStore` 两个目录在同一路径下，在大小写敏感的文件系统时它是合法的，但是在大小写不敏感的文件系统下就是有冲突的。我们要转换成大小写不敏感的文件系统首先要解决的就是这个问题。使用该脚本后会输出很多文件，理论上你要一个个手动处理这些文件。如果文件位于缓存路径下可以直接删掉，位于用户目录下则要自己决定如何避免命名上的冲突。

## 2. 做一个全新的备份

这点没什么好说的，TimeMachine 作为 macOS 自带应用，可以方便的把系统备份到一个硬盘上。建议备份完成后把备份文件再多存一份，这样即使后面的操作失败了，至少你还可以恢复到之前的大小写敏感的文件系统下。

备份之前确保已经完成了第一步的命名冲突。如果你之前已经有了备份而只进行的增量备份，可以把之前备份删除掉，进入到你的硬盘目录下，使用 `tmutil` 删除之前的备份，只保留最后一个：

查看有多少备份：

```
$ ls -l /Volumes/TimeMachiiine/Backups.backupdb/tin/
total 9
drwxr-xr-x@ 3 root  wheel  204 29 Aug 10:04 2016-08-29-100422/
drwxr-xr-x@ 3 root  wheel  204 29 Aug 11:05 2016-08-29-110526/
lrwxr-xr-x  1 root  wheel   17 29 Aug 11:08 Latest -> 2016-08-29-110526
```

删除之前的备份：

```
$ tmutil delete /Volumes/TimeMachiiine/Backups.backupdb/tin/2016-08-29-100422
```

千万不要使用 `rm -rf` 来操作备份中的文件，那样会损坏备份文件的结构导致备份无法恢复(我猜的)。

## 3. 改表备份文件中的一个标志

使用以下命令改变备份文件中关于大小写敏感的标志，其中 `TimeMachiiine` 是你存放备份的硬盘名，`MacHD` 是你现在系统的硬盘名。

```
$ sudo /System/Library/Extensions/TMSafetyNet.kext/Contents/Helpers/bypass \
    xattr -w com.apple.backupd.VolumeIsCaseSensitive 0 \
    /Volumes/TimeMachiiine/Backups.backupdb/tin/Latest/MacHD
```

## 4. 恢复系统

1. 重启你的 Mac
2. 按住 Cmd+R 后按开机键，进入恢复模式的系统
3. 选择从 TimeMachine 恢复
4. 选择你之前操作过的那个备份
5. 进行恢复

恢复时会提示你要抹点目标硬盘所以你不需要手动格式化。如果之前操作进行的顺利，恢复完之后就完全解决了该问题。再次感谢文本头部提到的 repo 中提供的宝贵经验和脚本。
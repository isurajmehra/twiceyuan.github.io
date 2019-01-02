title: Chrome书签图标不显示以及关闭自动更新的方法
date: 2013-10-12 14:50:27
tags: [Chrome, macOS]

---

最近在OS X Mavericks 上升级 Chrome 30之后发现频繁崩溃，查找查找相关资料发现属于 Chrome 的bug，所以在先退回29。
遇到 Chrome 书签不显示（比如在手动升级直接替换app文件的时候），可以删除位于 Library/Application\ Support/Google/Chrome/Default/ 的 Favicons 文件后重启浏览器解决。

删除 Favicons

<code>rm Library/Application\ Support/Google/Chrome/Default/Favicons</code>

关闭 Chrome 自动更新

<code>defaults write com.google.Keystone.Agent checkInterval 0</code>

（PS: 新版本已经修复这个问题）
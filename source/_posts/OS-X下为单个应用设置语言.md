title: macOS下为单个应用设置语言
date: 2015-01-11 15:29:26

tags: [macOS]

---
OS X下的联系人应用在系统语言为英文时，排序总是有问题的，切换到中文就正常了。但又不喜欢看中文的界面，经过搜索可以为某个特定应用设置特定的语言。

    defaults write com.apple.AddressBook AppleLanguages '("zh_CN")'

其中`com.apple.AddressBook`是应用的包名，可以在Info.plist里查找到。

逆操作：

    defaults delete com.apple.AddressBook AppleLanguages
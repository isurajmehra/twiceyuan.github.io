title: Android 上的 git 服务器应用：Gidder
tags:
  - Android
  - Git
date: 2015-09-03 16:38:38
---

好久没更新文章了，水一篇娱乐向的应用推荐：Gidder —— 在 Android 上搭建 git 服务器。

<!--more-->

之前项目组一直使用 github 啦 Coding 啦之类的公共 git 服务（以后估计也是），github 不用说了，功能强大历史悠久但是速度慢，coding 是国内深圳（？）一家公司做的，速度啥的还不错。反正公共 git 服务的好处就不用多说了，省心省事省时省力。

不过为了代码<del>让别人看到有损公司形象</del>的安全。有时也需要自己搭一个 git 服务器，比如 gitlab 就是很好的一个 git 全家桶，包括了和 github 一样的 web 端，真是棒棒哒。但是我们没有服务器，只有一个二手国产低端机，所以好的废话不多说了开始！介！绍！

### 下载链接

[https://play.google.com/store/apps/details?id=net.antoniy.gidder.beta&amp;hl=en](https://play.google.com/store/apps/details?id=net.antoniy.gidder.beta&amp;hl=en)

### 使用说明

安装之后打开就会发现，这货压根不需要什么使用说明啊！简单到爆！不过相应的，不能在客户端建立仓库和用户，只能在这个 app 中建立固定的，不过这也够用了。

### 坑

欣喜若狂的边抖腿边把项目导入 Android Studio 中后，发现 push 有问题，push 时提示：

> Push failed: Failed with error: fatal: Could not read from remote repository.

google 了一下，发现是用了 Native 的 git，密码没办法填写（gidder 只能设置密码登录而不能使用私钥（Servers Ultimate 可以）），解决方法就是把 git 的设置从 Native 改为 Built-in 就行了，这样在 git push 时就会要求输入密码，然后输入在 gidder 中设置的对应账户密码就可以推送成功了。

### 感想

把 git 服务器握在手中有种莫名的安全感 _(:з」∠)_。

好久没写东西发现都不能好好说话了，写完了去吃药了 bye(╯-╰)/ 。

### 相关链接

1.  Gidder 居然是开源的！ [https://github.com/antoniy/Gidder](https://github.com/antoniy/Gidder)
2.  一个类似 Gidder 的更黑科技的服务器全家桶 Servers Ultimate Pro，支持各种常用服务器，地址请自行搜索。
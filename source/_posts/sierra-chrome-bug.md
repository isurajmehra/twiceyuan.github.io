title: 升级 macOS Sierra 后 Chrome 打开 HTTPS 的网页出错的问题
tags: macOS
date: 2016-09-26 00:30:59

---
升级 macOS 后，Chrome 访问 HTTPS 的网页总是一闪而过一个错误，然后才会加载成功。在网上看到别人说可能和支付宝的服务有关，移除之后就正常了。移除命令：

    sudo launchctl remove com.alipay.DispatcherService

更彻底一些的：

    sudo rm -rf /Library/Application\ Support/Alipay /Library/LaunchDaemons/com.alipay.DispatcherService.plist ~/Library/LaunchAgents/com.alipay.adaptor.plist -rf ~/Library/LaunchAgents/com.alipay.refresher.plist ~/Library/Internet\ Plug-Ins/aliedit.plugin ~/Library/Internet\ Plug-Ins/npalicdo.plugin

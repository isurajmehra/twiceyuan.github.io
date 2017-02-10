title: 关于 Android 背景色 Alpha 值的一个坑
date: 2017-01-12 23:35:13
tags: [Android]

---
这是公司项目一个留了很久的 bug，尝试找了很多次原因都没有头绪。这个 bug 是这样的：

定义了一个主题色为例如 #FF0000，很多界面控件都用了这个颜色。可是这个颜色在 app 使用过程中用着用着就会出现变成了透明的情况，而且出现透明之后，所有使用这个颜色的控件都会变成透明。

更奇怪的是，重启应用会恢复这个问题，但是操作一会儿又会出现。
<!--more-->
项目有个随着页面滚动标题栏从透明过渡到主题色的界面实现，类似于 Design 库中 AppBar 的那种效果。实现方法是这样的：

    // 滚动监听器 伪代码
    someParams -> {
      //...
      view.getBackground().setAlpha(percent);
      //...
    }

今天「代码级复用」这一 feature 时，发现把 bug 也引入了新项目，才发现这个实现的问题之所在……

首先，view.getBackground() 获得的是一个 ColorDrawable，然后给这个 ColorDrawable 设置 Alpha 值的话，会影响所有设置 background 为这个颜色的背景色的 Alpha 值。

然后就写了个小 demo 验证了一下这个说法，虽然不是立即生效的，然后返回退出应用后，两个相同颜色背景的 view，改变其中一个确实会影响到另一个。

当时反应就是：WTF？难不成全局的相同颜色的 Drawable 都是同一个对象？不过很快打印了一下 background 的 drawable 对象验证了并不是这样——虽然这些 view 获得的 ColorDrawable 的 Alpha 值都相同，但 hashcode 都是不同的。

所以我更倾向于这是 Android 内存优化带来的 bug，即使这个颜色在定义时就有 Alpha 值，在修改后也会被忽略，并影响到其他的 view。该问题只在布局文件里设置 background 为一个 color 的 id 或者值，或者 setBackgroundResource 为一个 color 时存在。如果使用 new ColorDrawable(int) 来构造一个使用相同颜色值的对象则不受影响，我目前也正是使用这个方法来躲避掉这个 feature。
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



UPDATE：

发现文档里有这个方法，验证了之前的说法，从同一资源加载的 drawable 确实会共享状态，不过有一个 mutate 方法来禁用这一特性。文档如下：

> [Drawable](file:///Users/twiceYuan/Library/Application%20Support/Dash/DocSets/Android/Android.docset/Contents/Resources/Documents/developer.android.com/reference/android/graphics/drawable/Drawable.html) mutate ()
>
> Make this drawable mutable. This operation cannot be reversed. A mutable drawable is guaranteed to not share its state with any other drawable. This is especially useful when you need to modify properties of drawables loaded from resources. By default, all drawables instances loaded from the same resource share a common state; if you modify the state of one instance, all the other instances will receive the same modification. Calling this method on a mutable Drawable will have no effect.
>
> **翻译：**
>
> Drawable mutate ()
>
> 让一个 Drawable 变为 mutable 的。这个操作是不可逆的。一个 mutable 的 drawable 可以保证不会分享自己的状态给其他 drawable。当一个 drawable 是从 resource 加载的，在需要更改它状态时这个方法特别有用。在默认情况下，所有从相同 resource 的 drawable 的实例是共享一个通用状态的；如果你修改了其中一个的状态，所有其他的实例也会收到相同的改动。在一个已经是可变的 drawable 上调用该方法没有效果。

所以，上述代码只要在 drawable 获取之后，调用一下 mutate() 方法即可。


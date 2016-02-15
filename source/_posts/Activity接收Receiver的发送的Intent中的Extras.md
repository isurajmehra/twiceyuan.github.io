title: Activity 接收通知中的发送的 Intent 中的 Extras

date: 2015-11-21 11:49:27

tags: [Android]

---

在通知中创建一个通知，并且指定通知点击后的 Intent 时，会遇到 put 进 intent 中的 extras 在启动的 Activity 中无法获取到的问题。

查了一下，原因是从通知进入 Activity 时， getIntent() 方法默认返回的是 Activity 的「第一个」Intent，如果从通知点击时，Activity 在后台或者在睡眠，这个 intent 就不是我们想要传入的 intent。

那么怎么获取到新的 intent 呢？当然有办法：重写 Activity `onNewIntent(Intent newIntent)` 方法，获取这个方法里的 intent 中的 extras，就是我们从通知中 setContentIntent 中 PaddingIntent 里的 Intent 了(通知中发送 Intent 需要有一个 PaddingIntent 包装)。

然后该 Intent（被包装的） 还需要设置 Flag 为：

    Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_CLEAR_TOP
    

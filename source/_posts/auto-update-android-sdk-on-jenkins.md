title: Jenkins 中如何让 Android SDK 根据需要自动更新
date: 2016-11-18 22:45:59
tags: [Android, CI]

---

每次项目中切换了新的 support，总是要登录构建服务器更新一下 SDK，很麻烦。其实 Jenkins 本身是支持自动更新的，稍微留一下会发现，构建时不存在的 SDK 的报错信息为：

> You have not accepted the license agreements of the following SDK components: ...

原来是 license 问题，需要手动去 agree 才能进行下一步，所以就中断了。但其实是可以跳过的，Stackoverflow 上有人引用了 Jake Wharton 给出了方法：

```
mkdir "$ANDROID_SDK/licenses" || true
echo -e "\n8933bad161af4178b1185d1a37fbf41ea5269c55" > "$ANDROID_SDK/licenses/android-sdk-license"
echo -e "\n84831b9409646a918e30573bab4c9c91346d8abd" > "$ANDROID_SDK/licenses/android-sdk-preview-license"
```

上面的哈希字符串据说是 license 文本的 sha1，所以如果 license 换掉的话也会失效。暂时这样用吧。



参考：http://stackoverflow.com/questions/38096225/automatically-accept-all-sdk-licences
title: 关于Adapter的一个异常
date: 2015-11-22 22:50:55
tags:  [Android]

---

如果你在 Android BaseAdapter 中看到了这样一个异常：

	java.lang.NullPointerException: Attempt to invoke virtual method 'int android.view.View.getImportantForAccessibility()' on a null object reference

十有八九是你忘了把 getView 传递的 convertView 给 return 了。。。

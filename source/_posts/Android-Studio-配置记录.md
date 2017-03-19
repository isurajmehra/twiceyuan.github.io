title: Android Studio 配置记录
tags:
  - Android
  - Android Studio
categories: []
date: 2015-05-09 12:22:00
---
记录 Android Studio 一些自认为有用的配置。

<!-- more -->

-  方法分割线

   一个类中方法多着看着不习惯，特别是在方法中嵌套监听器之类的时候，总是感觉分不清哪个是外层的哪个是内层的。其实 Android Studio 可以设置方法的分割线。

   设置方法：

   `Settings` > `Editor` > `General` > `Appearance` 中，勾选「`Show method separators`」

-  选中词高亮

   默认的选中词效果是一个下划线，如果想在一个类文件中寻找这个下划线估计不太容易。可以通过修改这个词的背景色来增加它的可辨识性。修改方法如下：

   `Settings` > `Editor` > `Colors & Fonts` > `General` 中，改变 `Identifier under caret` 和 `Identifier under caret(write)` 的 `background` 属性就可以了。

-  成员变量按列对齐

   强迫症患者福音，自动格式化的时候对齐类中成员的关键字、类型和变量名，Android 中使用 Butterknife 生成 View 绑定代码时强烈使用，有效改善生成代码的可读性。
   
   `Settings` > `Code Style` > `Java` > `Wrapping and Baces` > `Field Groups` > `Align in columns`（勾上）

-  Tips of the day

   这个都知道，是默认开启的，但是如果不小心关掉了呢？选择菜单栏上的 Help > Tips of the day 就可以重新开启了。

-  Live template

   编写代码模板。这个在 Settings 里搜索就可以找到，可以编辑一些常用的代码片段使用自己设定的几个字母快速生成。当然，某些情况下更方便和优雅的还是抽象出方法。
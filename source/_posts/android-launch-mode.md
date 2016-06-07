title: Android 启动模式（LaunchMode）
date: 2016-06-07 16:06:46
tags: [Android]
---

一直对 Android 启动模式有点含糊，主要是使用率不高，一旦使用起来总是再去查一下，然后用完就忘了，今天仔细看了一下，貌似之前理解的确实不透彻，这里再简单介绍一下。

<!--more-->

LaunchMode 是在 Manifest 文件中的 Activity 标签下定义的，属性名就是 launchMode，共有四个值：Standard、SingleTop、SingleTask 和 SingleInstance。其中 Standard 是默认的，即如果没有标注这个属性，这个 Activity 就是以 Standard 模式启动的。



用点菜的比喻总结一下。activityClass 相当于菜单，task 栈相当于一张桌子，每张桌子只有一个盘子大小，因此要想放多个菜盘子是叠起来的。

## Standard 模式

Standard 模式下，用菜单点一个菜就上一盘新的(create)，放到你的桌子的最上面，每点一个菜就盖在前一个菜的最上面。

> Standard 根据 activityClass 创建一个实例，添加到当前 task 的栈顶。不过测试发现如果当前处于其他 task，创建的 activity 仍然会处于原来的 task 栈

 ![Standard](Standard.png)

## SingleTop 模式

SingleTop 模式下，上这个菜时，服务员会看一下你桌子上的最上面这个菜是不是这个菜，如果是，就不上了（onNewIntent）；如果不是，再加一盘在这个桌子的最上面。

> SingleTop 只有在这个 activityClass 的实例在当前的栈顶时，不会创建 activity，只是调用 onNewIntent 方法。其他情况下还是会创建 activity

 ![SingleTop](SingleTop.png)

## SingleTask 模式

SingleTask 模式下，服务员上这盘菜时，会翻起来看每个盘子有没有这个菜，如果有，把这个菜上面的菜都拿走（destroy）。

> SingleTask 如果发现栈里有该 activity，清空该 activity 上层的 activity，使这个 activity 重新处于栈顶。这里测试的确实是这样，当启动了 SingleTask 的 activity 后，再启动 N 个其他 activity，然后再启动 SingleTask activity，相当于前面 N 多 activity 全都 destroy 了。

 ![SingleTask](SingleTask.png)

## SingleInstance 模式

SingleInstance 模式下，服务员会给你找个新桌子，这个桌子只能放这个 activity 一盘菜。
当上这盘菜时系统会检查有没有这个菜的桌子，有的话直接搬到你面前，没有的话再去找张桌子放下。

> SingleInstance。创建另外啊一个任务栈并且在这个栈中只放自己，不允许其他 Activity 进入。这个模式在任何情况下都不会重复创建 Activity。

 ![SingleInstance](SingleInstance.png)

















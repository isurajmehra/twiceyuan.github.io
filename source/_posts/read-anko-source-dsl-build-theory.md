title: Anko 源码阅读笔记：构建 DSL 的基本原理
date: 2017-12-06 14:23:59
tags: [kotlin, Android]

---
官方给出这一段 Anko AlertDialog DSL 的例子：

```kotlin
alert("Hi, I'm Roy", "Have you tried turning it off and on again?") {
    yesButton { toast("Oh…") }
    noButton {}
}
```

这段代码可以构造出一个简单的对话框控件，下面介绍一下这种代码是如何被 Kotlin 解析的。

<!-- more -->

### 扩展函数，让函数在合适的上下文中直接调用

首先 `alert()` 能够直接调用有可能可能：一种是它符合当时调用上下文，是当前上下文的扩展函数；一种是它被定义为全局函数，可以类似 Java 中 `static import` 的方式来全局调用。这里它其实是前者，我们可以查看它的定义：

```kotlin
fun Context.alert(...) { ... }
```

说明我们是在 Context 或者其子类中调用的 `alert` 方法。除此之外源码中还可以看到另外两种定义：

```kotlin
inline fun AnkoContext<*>.alert() = null
inline fun Fragment.alert() = null
```

第一个是在 Anko Layout 下使用时的上下文，第二个是 Fragment 下调用时匹配的函数，这两种其实本质都是在上下文中寻找合适的 context 来调用 Context 的扩展函数 `alert`。还有很多比如 `dip`，`toast` 都是基于 Context 的扩展函数，使用这一特性都使这些工具方法在 Kotlin 下用起来很方便。

### 带接收者的 Lambda 表达式

在 `alert {}` 的 `{}` 内可以看到，可以直接调用 alert 相关的属性进行定义，比如 `title`，仿佛 `title` 这个属性就在当前上下文一般。如果你用过 kotlin 库函数中的 `apply` 和 `with` 可能对这种函数比较熟悉。比如 `apply` 的实现非常简单：

```kotlin
public inline fun <T> T.apply(block: T.() -> Unit): T { block(); return this }
```

其中的参数 block 的类型在 Java 中不会找到类似语法，这里就是一个典型的带接收者的 lambda 表达式，它的语法是这样的：

```kotlin
class Test {
  var name : String? = null 
}

fun f_name(expression: Test.() -> Unit) {
  val test = Test() // 函数接收者
  expression.invoke(test) // 使用接收者调用该函数
  println(test.name) // 测试是否改变接收者的属性
}

fun main(vararg args: String?) {
  f_name {
    // 这里可以直接或使用 this. 调用 name 属性来赋值
    name = "twiceYuan" 
    // 或 this.name = "twiceYuan"
  }
}
```

这种语法可以带来这样的效果：在一个函数参数的 block 中（即被 "{"、"}" 包裹的内容），可以直接使用这个函数指定的对象的任何属性和函数，它类似于默认的 lambda 参数 it，只不过调用 it 的属性和函数时不再需要写 "it." 来完成，而是直接使用或者用 “this.”。

这时再来看 `apply` 函数的实现，它展开后是这样的：

```kotlin
fun <T> T.apply(block: T.() -> Unit): T { 
  block()
  return this 
}
```

这里的 `block()` 完全等价于 `block.invoke(receiver)`，而 `receiver` 在这里又是指向 `this ` ，而 this 又是可以省略的。所以这里其实是相当于使用调用 `apply` 函数的主体，执行 `apply` 参数里 block 的内容，并且可以直接使用这个主体的属性和函数，这恰好就是 `apply` 函数的说明。

这两点就是在 Kotlin 中定义 DSL 的基本原理。
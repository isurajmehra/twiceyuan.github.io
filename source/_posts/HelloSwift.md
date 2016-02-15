title: HelloSwift
date: 2015-01-24 15:24:10
tags: Swift
toc: true
  
---

> Swift作为一个明星语言从诞生就颇受关注。这几天看了一些视频教程，发现基本语法从刚出炉到现在就有很多变动，看来看视频学语言还是件不太靠谱的事情，在这里总结一下Swift的基本语法，以供之后自己和别人查阅。当然最好的还是读文档，中文翻译很nice：[Swift中文文档](http://numbbbbb.gitbooks.io/-the-swift-programming-language-/)。本文讲的是最最基本的语法，适合有过其他语言基础的人来快速熟悉Swift。

<!--more-->

Hello, World
--------------------------------------
编程第一步。当你创建出来一个Swift程序时其实开发环境已经生成了这一行代码：

    println("Hello, World!")

变量和常量
--------------------------------------
变量是var，常量是let

比如：

    var a = 1 // 变量a
    var b = 2 // 变量b
    let c = a + b // 常量c

数据类型
--------------------------------------
变量和常量定义中也可以看出，Swift可以和JS一样定义时不指定类型。想要指定的话，在变量名后加冒号和数据类型名就可以了，比如：
    
    var str:String = "我是一个字符串"
    var i:Int = 1 // 这是一个无法自证的整型    

字符串操作
--------------------------------------
字符串操作方面Swift有些特殊，但也十分方便。两个字符串之间可以直接使用+号来连接，非字符串可以使用"\(var)"来进行转换并与其他字符串连接，类似于Java的toString()方法。
比如：

```
    var msg = "Hello, I'm" // 字符串
    var age = 22 // 整型
    
    let result = msg + " \(22)" // 转换整型并与字符串连接
    
    // Output
    // Hello, I'm 22
```

数组
--------------------------------------
数组定义上，貌似和刚发布时有些不同，比如`var arr = String[]()`这种方法已经失效。想要定义一个空数组的方式为：

```
    // 不指定类型的
    var arr = []
    // 指定数组元素类型的
    var arr2:[String] = []
    // 指定元素的
    var arr3 = ["Hello", 123, 255.5]
```

字典
--------------------------------------
类似于Map的数据类型。可以在定义时直接赋予初值。有这样一些基本用法

```
    var dict = ["name": "twiceYuan", "site": "twiceyuan.com"] // 赋初值
    
    dict["age"] = "22" // 添加或修改键值
    dict["birth"] = "19930302" // 添加或修改键值
    dict.removeValueForKey("site") // 根据键删除值
    
    println(dict) // 输出
    
    // Output
    // [age: 22, birth: 19930302, name: twiceYuan]
```

循环
--------------------------------------
这边遇到的不同最多。这边只说现在的格式吧：

### for循环

* 遍历数组

```
    var arr = ["Hello", "World"]
    for str in arr {
      println(str)
    }
    
    // Output
    // Hello
    // World
```
    
* 带计时器的遍历

```    
    var arr = ["Hello", "World"]
    for index in 0...1 {
      println("\(i+1). "arr[index])
    }    
    // Output
    // 1. Hello
    // 2. World
```
    
* 字典的遍历


```
    let dict = ["name": "yuan", "site": "twiceyuan.com"]
    for (key, value) in dict {
        println("\(key)是 \(value)")
    }
    
    // Output
    // name是yuan
    // site是twiceyuan.com
```
    
* 还有一种类似C语言的遍历，功能和也可实现上述循环的功能

（TO BE CONTINUE）
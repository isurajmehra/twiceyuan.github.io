title: Kotlin 中的属性委托：ValueKit 的实现介绍
date: 2017-12-10 23:50:54
tags: [kotlin, Android]

---
RetroPreference 是我之前用 Java 写的一个在 Android 项目里方便使用 SharedPreferences 的小工具，它能像 Retrofit 一样定义一个方便查看和管理的接口，然后通过库提供的方法创建实现这个接口的实例来完成对 SharedPreferences 的操作。很早之前我也用 Kotlin 重写了这个工具，但是基本类型必须有一个默认值这点感觉不是很符合使用者的需求。在学习 Kotlin 的委托属性后，我意识到可以用它更简单的实现这个工具。

<!-- more -->

首先需要知道属性委托是做什么的。用过 Kotlin 的都知道，Kotlin 可以通过定义 get 和 set 的 operator 来省略 getter 和 setter 的定义(data class 可以自带这个操作符免于定义)，然后在读取该属性时只要 `a.b` 的形式来读、`a.b = c` 的形式来写就可以了。而属性委托就是可以标记这个属性的 setter 和 getter 操作由另外一个委托对象完成。这个委托对象可以接收到属性的所有者、属性的类型、名称，这基本满足了之前使用动态代理获取接口方法属性的要求，而且直接把一个存储的配置项定义为属性而不是方法显然更符合语义。所以我们希望这个工具实现后可以这样来使用（代码 1）：

```kotlin
object Config {
  var username by StringValue
}

fun someFunction {
  println(Config.username)      // 读取配置
  Config.username = "twiceYuan" // 写入配置
}
```
是不是像写变量一样简单？Kotlin 的属性委托使得这种实现成为可能。首先方便理解，需要说明上述代码中的 `username` 类型为 `String?`，StringValue 的定义中 getValue 和 setValue 中写明了这点使得它可以正确的被推测类型（代码 2）：

```kotlin
object StringValue {
    operator fun <T : Any> getValue(t: T, property: KProperty<*>): String? {
      return read(t, property.name) as String?
    }

    operator fun <T : Any> setValue(t: T, property: KProperty<*>, newValue: String?) {
        write(t, property.name, newValue)
    }
}
```

`read` 和 `write` 方法就是读取和保存这些配置的具体实现。为了基础类型的 Nullable，这里没有把实现对应到 `SharedPreferences` 上，不过这与本文介绍的内容无关。

`getValue` 和 `setValue` 是一个委托对象需要实现的方法，它们接收两个参数，第一个为属性的所有者，即上述代码中的 Config 对象，第二个参数为属性信息，通过 `property.name` 可以获取这个属性的名称（混淆配置中记得 keep `Config` 所在的文件）。

定义完成后，在代码 1 的 `someFunction` 中就可以调用委托对象的 getter、setter 方法来操作属性了。

如果我需要保存一个 Serializable 的对象，Object I/O Stream 明显提供了这样的操作，这样该如何完成呢？设想使用时应该是这样的（代码 3）：

```kotlin
object Config {
  // ...
  // 存储一个个人信息
  var person by ObjectValue<Person>()
}
```

这里可以看出 `ObjectValue<Person>` 后有个 `()` 表示是创建一个对象，这是因为 object 单例不能生命一个带类型参数的对象（因为它是固定的）（这其实是一个优化点，因为如果项目中含有大量相同类型的 `ObjectValue<T>` 其实只需要一个即可）。

对于这种用法，只需要定义带参数的委托对象即可（代码 4）：

```kotlin
class ObjectValue<Object: Serializable> {
    operator fun <T : Any> getValue(t: T, property: KProperty<*>): Object? {
        return read(t, property.name) as Object?
    }

    operator fun <T : Any> setValue(t: T, property: KProperty<*>, newValue: Object?) {
        write(t, property.name, newValue)
    }
}
```

如果不考虑使用者的方便性，只需要一个 ObjectValue 来实现这个工具也是可行的，因为基本类型也是实现了 Serializable 的类型，可以使用相同的方法来保存读取。

以上代码均属于 ValueKit 这个小工具的实现，欢迎 review：https://github.com/twiceyuan/ValueKit
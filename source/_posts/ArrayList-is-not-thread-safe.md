title: ArrayList 是线程不安全的
date: 2016-06-09 16:28:21
tags: [Java]
---

发现自己在代码中经常会犯一个常识性错误：在多线程环境下使用同一个 ArrayList。ArrayList 是线程不安全的，不安全性主要表现在元素的操作互相没有互斥性，例如在线程1中添加了元素 a，而在线程2 中查询该 list 的长度时，却可能发现 list 长度为 1，而元素只有一个 null。

<!--more-->

talk is cheap: 

```java
private static void test(List<String> stringList) {
  // 用于获得 List 的实现类名，例如 ArrayList
  String className = stringList.getClass().getSimpleName();

  new Thread(() -> Stream.of("1", "2").forEach((e) -> {
    stringList.add(e);
    System.out.println(className + " 添加了 " + e);
    System.out.println(className + stringList.toString());
    System.out.println(className + " [length=" + stringList.size() + "]");
  })).start();

  new Thread(() -> Stream.of("1", "2").forEach((e) -> {
    stringList.add(e);
    System.out.println(className + " 添加了 " + e);
    System.out.println(className + stringList.toString());
    System.out.println(className + " [length=" + stringList.size() + "]");
  })).start();
}
```
上述代码是一个方法，用于传入一个 List，然后建立两个线程，同时添加"1", "2"，两个元素。并且在每次添加之后打印添加的结果。

 建立一个 ArrayList 对象，并调用上述方法测试。

```java
 List<String> stringList1 = new ArrayList<>();
 test(stringList1);
```

 代码执行后，输出可能就是这样的（多线程代表了诸多不确定性，每次输出结果都可能不同）：

```
ArrayList 添加了 1
ArrayList 添加了 1
ArrayList[null, 1]
ArrayList[null, 1]
ArrayList [length=2]
ArrayList 添加了 2
ArrayList [length=2]
ArrayList 添加了 2
ArrayList[null, 1, 2]
ArrayList [length=4]
ArrayList[null, 1, 2, 2]
ArrayList [length=4]
```

## 如何改进？

在上述例子中，可以体现出在 `add`，`size` 和 `toString` 的执行过程中出现了一个方法执行到一半而执行了另一个方法的情况，由此产生了输出不一致的问题。针对上述情况，继承 ArrayList 进行同步限制：

```java
private static class SafeArrayList<T> extends ArrayList<T> {

  private static final Object lock = new Object();

  @Override
  public boolean add(T o) {
    synchronized (lock) {
      return super.add(o);
    }
  }

  @Override
  public String toString() {
    synchronized (lock) {
      return super.toString();
    }
  }

  @Override
  public int size() {
    synchronized (lock) {
      return super.size();
    }
  }
}
```
这样执行之后的输出：

```
SafeArrayList 添加了 1
SafeArrayList[1]
SafeArrayList 添加了 1
SafeArrayList[1, 1]
SafeArrayList [length=2]
SafeArrayList [length=2]
SafeArrayList 添加了 2
SafeArrayList 添加了 2
SafeArrayList[1, 1, 2, 2]
SafeArrayList[1, 1, 2, 2]
SafeArrayList [length=4]
SafeArrayList [length=4]
```

## Vector

Java 中的 Vector 就是针对于多线程情况下做过处理的一个 List 实现。在上述代码实现中，只实现了三个方法的互斥，实际使用上需要考虑的则远不止这么多，因此需要真正做到线程安全的操作 List 建议使用 Vector。


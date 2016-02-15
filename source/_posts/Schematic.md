title: 自动生成 ContentProvider 注解框架 Schematic
tags:
  - Android
date: 2015-09-07 11:26:50

---


ContentProvider 是 Android 四大组件之一，主要负责应用内数据库实例的管理，是系统提供的有效管理数据库实例的方式之一。虽然在官方文档中有说过：「如果应用不向外部提供数据，可以不必使用 ContentProvider」，但出于它的一系列好处，我们仍然偏爱于建立 ContentProvider 来管理数据库。不过 ContentProvider 的代码比较繁琐而且格式单一，所以就促使一些类库的产生，今天就发现了一个不错的可以自动完成 ContentProvider 大部分工作的注解框架：Schematic。

> 项目地址：https://github.com/SimonVT/schematic
> 本文仅为翻译

<!--more-->

简介
=========

自动生成一个由 SQLite 数据库支持的 ContentProvider。

用法
=====

首先根据数据库中一张表创建一个包括表中所有列的类。

```java
public interface ListColumns {

  @DataType(INTEGER) @PrimaryKey @AutoIncrement String _ID = "_id";

  @DataType(TEXT) @NotNull String TITLE = "title";
}
```

然后创建一个数据库类（使用框架中的注解方法）使用刚刚创建的包括列的类。

```java
@Database(version = NotesDatabase.VERSION)
public final class NotesDatabase {

  public static final int VERSION = 1;

  @Table(ListColumns.class) public static final String LISTS = "lists";
}
```

最后定义一个 ContentProvider

```java
@ContentProvider(authority = NotesProvider.AUTHORITY, database = NotesDatabase.class)
public final class NotesProvider {

  public static final String AUTHORITY = "net.simonvt.schematic.sample.NotesProvider";

  @TableEndpoint(table = NotesDatabase.LISTS) public static class Lists {

    @ContentUri(
        path = Path.LISTS,
        type = "vnd.android.cursor.dir/list",
        defaultSort = ListColumns.TITLE + " ASC")
    public static final Uri LISTS = Uri.parse("content://" + AUTHORITY + "/lists")
  }
```


加入到你的项目中
=========================

我推荐使用 android-apt 插件。它不会把编译器构建打包进最终的 apk 中，并且也会设置源码路径，这样 Android Studio 就可以找到生成的 class 文件。

项目配置文件对应位置加入：

```groovy
  dependencies {
    classpath 'com.neenbedankt.gradle.plugins:android-apt:1.7'
  }

  repositories {
    mavenCentral()
  }

```

module 配置文件对应位置加入

```groovy
apply plugin: 'com.android.application'
apply plugin: 'android-apt'

dependencies {
  apt 'net.simonvt.schematic:schematic-compiler:0.6.3'
  compile 'net.simonvt.schematic:schematic:0.6.3'
}
```

> 原文中作者并没有给出确切的版本，这里的版本仅仅作为参考。

License
=======

    Copyright 2014 Simon Vig Therkildsen

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.

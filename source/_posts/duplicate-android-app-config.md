title:  Android App 开发环境和线上环境共存的 gradle 配置小技巧
date: 2016-09-09 20:06:13
tags: Android

---

前段时间考虑过一个问题：例如我在公司负责产品 A 的开发，但是我又需要在下班后使用公司产品怎么办？一般公司的服务端都会区分线上和线下环境，在开发时使用开发的环境以免脏数据污染线上的环境，而下班后每次都卸载重装的话感觉又有些蛋疼，今天想到可以用设置 flavor 的方式解决这一痛点，分享一下这个方案的配置过程。

<!--more-->

方案简单来说就是开发时使用另一个 applicationId。之所以之前没有想到这个方案，主要是之前对包名和 applicationId 两个概念产生了混淆。因为大部分情况下，Android App 的包名都是和 Application ID 相同的，这本身没什么问题，但是它们其实没有任何关系，所以为了解决上面所说的痛点，可以采用修改 applicationId 的方式来开发，而在需要输出版本给外部(测试、运维)时，采用原来的 applicationId。

然后为了尽可能的懒和不会出差错，比如输出的包是自己改过 applicationId 的，可以用 gradle 配置中的 flavor 来解决这个事情。flavor 常用被用于打渠道包，主要功能就是能预先设定一些常量配置，在项目中去读取这些常量来打包 apk。在 flavor 中，可以使用 applicationId 才指定固定 flavor 的应用唯一标识：

```groovy
final RELEASE_APP_NAME = "线上版本"
final DEVELOP_APP_NAME = "开发版本"

final RELEASE_APP_ID = "com.twiceyuan.duplicatesample"
final DEVELOP_APP_ID = "com.twiceyuan.duplicatesample.dev"

android {
  // ... 其他配置
  defaultConfig {
    // 默认使用线上的，避免有遗漏没有配置的渠道错误输出开发的配置
    applicationId RELEASE_APP_ID
    resValue "string", "app_name", RELEASE_APP_NAME
    // ... 其他配置
  }
  productFlavors {
    dev {
      applicationId DEVELOP_APP_ID
      resValue "string", "app_name", DEVELOP_APP_NAME
    }

    prod {
      applicationId RELEASE_APP_ID
      resValue "string", "app_name", RELEASE_APP_NAME
    }
  }
}
```

使用 `resValue "string", "app_name", RELEASE_APP_NAME` 配置应用名称的目的是在启动器中区分开发版和线上版，使用这种方法定义资源之后，要在原项目 `strings.xml` 中删除 `app_name`这个字符串资源，否则会有重复定义错误。

配置完成后，就可以装个公司线上版本的 app 来用了，每次开发执行的将是另一个实例，只有在发布线上版本时才会运用原来的 applicationId，只要记得不要输出 flavor dev 给外部就好了，我一般在 dev 里会有很多方便测试的配置，例如一些调试工具的依赖，最低 SDK 兼容版本等，所以基本不会出现这个情况，即使出现也会第一时间被发现。


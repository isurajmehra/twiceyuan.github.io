title: 使用 Git 的 tag 管理 App 版本
date: 2018-08-01 17:43:20
tags: [Android, Git]

---

Android 应用开发到打包上线经常有这样的场景：需要上线了，打了个包，发现版本号没改；然后改了版本号，再打包，提交。为了方便以后定位版本，我们一般还会在发布后为这个版本打个 tag，这个 tag 会标记我们上线前的最后一次提交。
<!--more-->

经过优化后，我们得到这样的流程：上线前确认版本的名称，比如 1.0。将 1.0 作为 tag 名称新建一个 tag 并推送，git 服务器通过 WebHook 触发 CI 构建这个版本的 APK，并根据 tag 名称来生成版本名(Version Name)，根据 tag 的数量生成版本号 (Version Code)；如果发现上线前仍需改动，直接删除这个 tag，修改提交直到达到上限标准后再次创建 tag，触发构建。

实现这个流程的第一步，就是在 gradle 中添加两个方法来获取版本名和版本号：

```groovy
// 根据应用提交记录数来生成版本号
def getAppVersionCode() {
    def stdout = new ByteArrayOutputStream()
    exec {
        commandLine 'git', 'tag', '--list'
        standardOutput = stdout
    }
    return stdout.toString().split("\n").size()
}

// 获取最新的 tag 名称
def getLastTagName() {
    def stdout = new ByteArrayOutputStream()
    exec {
        commandLine 'git', 'describe', '--abbrev=0', '--tags'
        standardOutput = stdout
    }
    return stdout.toString().trim()
}
```

之后修改 Application 应用中 `android` -> `defaultConfig` 中的相关属性为方法获得：

```groovy
android {
    //...
    defaultConfig {
        //...
        versionCode getAppVersionCode()
        versionName getLastTagName()
        //...
    }
    //...
}
```

这样在执行 assemble 任务打包时，APK 的版本名和版本号都会从 git 的 tag 信息中获取（包括本地调试）。下一步就是解决 git 服务器出发的问题，这里 git 服务器和 CI 以最常见的 GitLab、Jenkins 为例。

首先在 Jenkins 的 Job -> Configure 中打开 Trigger builds remotely。然后在 GitLab 在项目界面的 Settings -> Integrations 中添加一个 Web Hook，URL 为 Jenkins 提供的 URL，Trigger 勾选 Tag Push Events。这样就完成了触发构建的流程。

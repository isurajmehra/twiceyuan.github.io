title: 开启用户鉴权时 Jenkins 触发远程构建时的 403 问题
date: 2018-08-01 15:58:07
tags: [jenkins]

---

在开启用户鉴权后使用 GitLab 的 WebHook 来触发 Jenkins 构建时，test 请求就会提示 403 鉴权错误，网上搜索了一波资料，大多都是提示修改一些安全设置或者开启匿名用户的 job read 权限。开启 job 的 read 权限后副作用是任何人都可以查看你在 jenkins server 上的构建任务，这对于位于公网上的 jenkins 实例无疑是不安全的，最后发现最佳的实践方式是通过 Jenkins 的 token 来完成鉴权并向 trigger 的 url 发送请求。步骤如下：

<!--more-->

1. 首先获取 Jenkins 用户的 Application ID 和 token。使用一个有效账户登录 Jenkins，然后在左侧边栏中进入 People，选择自己的账户，再点击右侧 Configure，在右部面板找到 API Token 这一栏，点击 Show API Token 即可查看当前用户的 Application ID 和 Token，同时也可以在这里重置 Token。
2. 获取请求地址，在 Job 的 configure 界面，勾选 Build Triggers 下的 Trigger builds remotely，token 自己填写一个，然后得到地址 `JENKINS_URL`/job/`JOB_NAME`/build?token=`TOKEN_NAME` 或者 /buildWithParameters?token=`TOKEN_NAME`
3. 在需要继承系统的 WebHook 中填写该 URL，在 host 前面加上 [Application ID]:[Token]@，比如 https://myid:mytoken@myjenkins.com/job/myJobName/build?token=my_job_token 。


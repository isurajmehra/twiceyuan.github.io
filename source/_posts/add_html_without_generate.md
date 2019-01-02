title: 在 hexo 的 source 文件夹下添加 html 文件方法
date: 2014-02-18 00:05:49
tags: Hexo

---

想要添加 html 文件而不被 hexo generate 生成，可以在 html 文件的最上面添加
```
---
layout: false
---
```
来完成。比如自己定制的 404 页面，或者 Google 搜索引擎的验证页。

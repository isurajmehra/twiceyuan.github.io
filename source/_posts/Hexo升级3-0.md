title: "Hexo升级3.0啦"
date: 2015-03-15 11:14:09
tags: [hexo]

---

Hexo 最近也升级 3.0 了。3.0 所有插件貌似都进行了模块化，在配置时附带了一些最基本的，其他的需要用户单独安装，比如 git 部署工具、RSS 生成工具。

详细的还是参考[官方文档](http://hexo.io)吧，现在中文也支持的很好。

另外，之前的添加的 hexo new 之后打开文件的脚本也失效，新的脚本为：

```
var spawn = require('child_process').spawn;
// Hexo 3
hexo.on('new', function(data){
  spawn('open', [data.path]);
});
```
<!--more-->
另外，Hexo3 也支持了一个非常实用的功能，以前也见到过很多人建议过，个人也觉得是对于管理博客非常需要的：[资源文件管理](http://hexo.io/zh-cn/docs/asset-folders.html)。下面这个图片就是使用这个来显示的。

{% asset_img hexo.png %}
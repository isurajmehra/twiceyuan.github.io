title: 怎么在 hexo new 的时候自动打开创建的文档？
date: 2014-02-17 20:52:29
tags: hexo
---
看到作者 github 上有人问这个问题，然后作者给的方案：

在 script 文件夹下创建脚本文件，内容为：

	var exec = require('child_process').exec;

	hexo.on('new', function(target){
	  exec('open -a Mou ' + target);
	});

我习惯使用 Mou 作为 markdown 的编辑器，当然你也可以换成自己喜欢的。这样在使用 `hexo new`创建新文档时就可以使用脚本中设置的编辑器自动打开了。 

> Hexo 3.0 之后失效，请参考 http://twiceyuan.com/2015/03/15/Hexo%E5%8D%87%E7%BA%A73-0/
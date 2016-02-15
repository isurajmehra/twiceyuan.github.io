title: 在某些图片上禁用 fancybox
date: 2014-08-12 17:45:44
tags: hexo
---
fancybox 这玩意儿挺不错的，不开启它的话，在点击图片的时候，时常会突兀的跳转到一个图片的页面上，体验很不好。

但是有些情况下，也希望 某些图片不使用 fancybox 的幻灯片效果（比如本博个人简介中的头像），在 hexo 中可以这样实现：

找到 主题文件夹下的 script 文件，比如 landscape-plus 就是 `themes/landscape-plus/source/js/script.js`,找到这段：

   ```
      // Caption
      $('.article-entry').each(function(i){
        $(this).find('img').each(function(){
          if ($(this).parent().hasClass('fancybox')) return;
          var alt = this.alt;
          if (alt) $(this).after('<span class="caption">' + alt + '</span>');
          $(this).wrap('<a href="' + this.src + '" title="' + alt + '" class="fancybox"></a>');
        });
        $(this).find('.fancybox').each(function(){
          $(this).attr('rel', 'article' + i);
        });
      });
      if ($.fancybox){
        $('.fancybox').fancybox();
      }
   ```

在`if ($(this).parent().hasClass('fancybox')) return;`下插入`if ($(this).hasClass('nofancybox')) return;`意思为如果遇到 nofancybox 类则跳过，这样在不需要 fancybox 显示 img 标签上的 class 改为 nofancybox 就可以禁用 fancybox 了。

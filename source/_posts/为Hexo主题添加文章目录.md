title: 为Hexo添加文章目录
date: 2015-01-12 21:10:31
tags: hexo
toc: true

---

Hexo在2.4.1添加了文章目录（Table Of Contents）功能，但是一些主题里可能默认并没有集成，下午搜索学习了一下，把方法做个总结（以Landscape为例）：
<!--more-->

##修改步骤

* 修改`layout/_partial/article.ejs`文件中，显示文章正文部分的代码：

   在`<%- post.content %>`的前面，插入：
   
   ```
   <div id="toc" class="toc-article">
     <strong class="toc-title">文章目录</strong>
     <%- toc(post.content) %>
   </div>
   ```
   
   这样做的话，新建文章的时候就可以通过指定toc为true或false来决定是否显示文章目录了。比如显示文章目录
   
   ```
   title: 为Hexo添加文章目录
   date: 2015-01-12 21:10:31
   tags: [Hexo]
   toc: true
   ```

* 修改代码之后，文章目录在页面的源码中已经可以看到了，但是并没有显示出来。还需要在CSS中添加toc相关的代码，比如我是在`source/css/_partial/article.styl`的最后添加了以下代码：

   ```
   /*toc*/
   .toc-article
   background #eeeeee
   margin 2em 0 0 0.2em
   padding 1em
   border-radius 5px
   .toc-title
     font-size 120%
   strong
     padding 0.3em 1

   ol.toc
     width 100%
     margin 1em 2em 0 0
   #toc
     line-height 1em
     font-size 0.8em
     float right
     .toc
       padding 0 
       li
         list-style-type none
     .toc-child 
       padding-left 0em
   
   #toc.toc-aside
     display none
     width 13%
     position fixed
     right 2%
     top 320px
     overflow hidden
     line-height 1.5em
     font-size 1em
     color color-heading
     opacity .6
     transition opacity 1s ease-out
     strong
       padding 0.3em 0
       color color-font
     &:hover
       transition opacity .3s ease-out
       opacity 1
     a
       transition color 1s ease-out
       &:hover
         color color-theme
         transition color .3s ease-out   

   ```


##效果图

修改完成后，可以新建一个文章或者修改以前文章的toc值来看看效果。这是我修改后的效果图，为了演示，本文也象征性的进行了分段并生成了toc。

![Landscape主题下文章目录效果图](/image/toc_demo.png)


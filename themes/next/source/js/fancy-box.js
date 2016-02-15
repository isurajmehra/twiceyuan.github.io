$(document).ready(function() {
  $('.content img').each(function () {
    var $image = $(this);
    var $imageWrapLink = $image.parent('a');
    // 如果不想让图片显示 fancybox 效果，就是用 nofancybox 这个 class
    if ($(this).hasClass('nofancybox')) return;

    if ($imageWrapLink.size() < 1) {
      $imageWrapLink = $image.wrap('<a href="' + this.getAttribute('src') + '"></a>').parent('a');
    }
    $imageWrapLink.addClass('fancybox');
    if(this.title){
      $imageWrapLink.attr("title",this.title); //make sure img title tag will show correctly in fancybox
    }
  });
});
$('.fancybox').fancybox({
  helpers: {
    overlay: {
      locked: false
    }
  }
});

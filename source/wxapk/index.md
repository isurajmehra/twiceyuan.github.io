title: 微信 APK 补丁显示图标配置
date: 2019-03-13 10:10:42

---

如果你需要在启动器中重新显示 “微信 APK 补丁” 的图标，请点击下面的按钮打开配置页面

<center><button class="button" onclick="openApp()">打开配置页面</button></center>

<script language="javascript" type="text/javascript">
var url = 'intent://wxapk/settings#Intent;scheme=wxapk;package=com.twiceyuan.wxapk;end';
window.setTimeout(function() {
 window.location.href = url;   
}, 3000);
</script>

<script  language="javascript" type="text/javascript">
function openApp(){
 // var url = 'intent://wxapk/settings#Intent;scheme=wxapk;package=com.twiceyuan.wxapk;end';
 url = 'wxapk://wxapk/settings';
 window.location.href = url;
}
</script>

<iframe src="wxapk://wxapk/settings"> </iframe>

(如果点击按钮没有反应，请使用系统浏览器打开该页面)
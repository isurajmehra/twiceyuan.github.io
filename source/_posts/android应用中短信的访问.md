title: Android应用中短信的访问
date: 2014-01-23 16:58:06
tags: [Android]

---

首先在 AndroidManifest.xml 文件中添加代码

`<uses-permission android:name="android.permission.READ_SMS"/>`

然后在程序代码中添加

`private static final Uri SMS_ALL = Uri.parse("content://sms")`

<!--more-->

在需要访问的地方

    Cursor c = context.getContentResolver().query(SMS_ALL, null, null, null, null);`

cursor结构：

 * 0._id
 * 1.thread_id
 * 2.address
 * 3.person
 * 4.date
 * 5.date_sent
 * 6.protocol
 * 7.read
 * 8.status
 * 9.type
 * 10.reply_path_present
 * 11.subject
 * 12.body
 * 13.service_center
 * 14.locked
 * 15.error_code
 * 16.seen

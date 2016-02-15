title: MongoDB 学习笔记2 —— 数据库的基本操作
date: 2014-10-01 19:35:07
tags: [MongoDB, 数据库]
---

###增

    db.db_name.insert(Object);

###删<!--more-->

    db.db_name.remove([{key,value}]);

###查

    db.db_name.find([{key:value}]);
    db.db_name.findOne([{key:value}]);

###改

#### 1. 使用 update 直接更新文档

获取文档：

	newObject=db.db_name({key:value});
	
修改文档：

	newObject.key=new_value

更新到数据库：
	
    db.db_name.update({key:value},newObject)

#### 2. 利用修改器更新

(1) $inc 自增修改器

属性增加指定数值

    db.db_name.update(key:value,{"$inc":1})
	
(2) $set 修改器

属性修改为指定值。如该属性不存在，则创建并赋值

	db.dbname.update(key:value,{"$set",key:value})
	
	并且可以修改 value 的数据类型，比如集合
	
	
(3) $push $pop 数组

(4) $ne 和 $addToSet 对比
title: J2EE&SSH 复习
date: 2014-12-26 20:07:03
tags: [Java EE, SSH框架, 课堂笔记, Ajax]
toc: true

---

> 作者：这是大三第一学期学习J2EE三大框架时考试前根据重点做的总结，现在整理到一篇文章里，方便以后查阅，也希望能对初学者提供一些参考。

<!--more-->

#SSH之前需要了解的
##Java基础部分
###Java 三大平台

* Java SE 标准版 _主要用于开发一般台式机应用程序_
* Java ME 微型版 _主要用于开发掌上电脑手机等移动设备使用的嵌入式系统_
* Java EE 企业版 _主要用于快速设计、开发、部署和管理企业级的软件系统_

###JSP 和 Servlet

* `<form>`标签
  * action属性：**接受表单的服务端程序或动态网页的地址**
  * method属性：**表单数据传输到服务器的方法**
    * POST： **在HTTP请求中嵌入表格数据**
    * GET：**将表单附加到请求该页的URL地址中**
* Servlet 和 JSP 的关系：

  \*.jsp文件被传送到服务器后先由服务器翻译成Servlet文件，而Servlet就是\*.java文件，然后\*.java文件又被翻译成\*.class文件再由JVM（Java虚拟机）解释执行。
  
* Servlet 生命周期
    
  * 开始：装载到容器
  * 初始化：调用`init()`方法
  * 处理请求：调用`service()`方法，根据不同的`doXXX()`方法处理客户端请求，并将结果封装在`HttpServletResponse`中返回给客户端
  * 移除：调用`destroy()`方法移除Servlet实例
  
* JSP 内置对象
  
  1. Request对象
  
    访问客户端**请求**的信息
  
  2. Response对象
  
    将服务器端的**响应**数据发送给客户端
  
  3. Session对象
  
    **服务器单独处理和记录客户端使用者信息的技术**
    
    
#Struts 2
##MVC

###MVC 的概念（了解）
* Model 模型：对操作数据对象的封装
* View 视图：处理数据显示的部分
* Controller 控制器：负责从视图读取数据，控制用户输入，并向模型发送数据


###MVC模式的优点
1. 多个视图对应一个模型
2. 模型返回数据和显示逻辑分离
3. 应用被隔离为三层，降低各层间耦合，提供应用可扩展性
4. 控制层包含用户请求权限的概念
5. 更符合软件工程化管理的精神

## Struts工作流程

* 基本流程

  1. 浏览器请求一个资源
  2. 过滤器Dispatcher查找请求，确定Action
  3. 拦截器Filter自动对请求应用通知功能，如验证和文件上传
  4. `execute()`方法存储数据和（或）重新获得信息
  5. 返回结果，可能是HTML、图片、PDF或其他
  
* struts 配置文件
    
  web.xml（位于WebRoot/WEB-INF下）

  ```
      <filter> <!--配置过滤器-->
          <filter-name>struts2</filter-name> <!-- 过滤器名 -->
          <filter-class>org.apache.struts2.dispatcher.FilterDispatcher</filter-class> <!--过滤器类的完整包名+类名-->
      </filter>
    
      <filter-mapping> <!-- 配置过滤器映射范围 -->
          <filter-name>struts2</filter-name><!--要配置的过滤器名-->
          <url-pattern>/*</url-pattern><!--过滤器映射范围 * 代表所有请求-->
      </filter-mapping>
  ```      

  struts.xml（位于src下）

  ```  
      <struts>
        <package name="default" namespace="/" extends="struts-default">
          <!-- 登录相关 -->
          <!-- name： action名，class：Action完整包名+类名 -->
          <action name="login" class="com.struts.action.ManagerAction">
            
              <!-- success：请求处理成功 -->
              <result name="success">/main_menu.jsp</result>
                
              <!-- error：请求处理失败 -->
              <result name="error">/login.jsp</result>
                
              <!-- input：验证输入 -->
              <result name="input">/login.jsp</result>
                
              <!-- none：请求完成后不做任何跳转 -->
              <result name="none"></result>
                
              <!-- login：返回登录页面 -->
              <result name="login">/login.jsp</result>
                
          </action>
        </package>
      </struts>    
  ```
      
##Struts几种校验器
  
  1. 必填字符串校验器
  2. 必填校验器
  3. 整数校验器
  4. 日期校验器
  5. 邮件地址校验器
  6. 网址校验器
  7. 字符串长度校验器
  8. 正则表达式校验器
  
##Struts的OGNL表达式
  
  `#foo.blah // 返回foo.getBlah()`
  
##Struts 标签
  
  1. `<s:if> <s:elseif> <s:else>`
     
     类似于Java中if、else if、else的使用
     
  2. `<s:iterator>`标签
  
     对对象进行枚举迭代，
     * values指定集合变量
     * id指定变量名。  
     * status产生一个IteratorStatus变量，包含一下属性方法：
       * int getCount(); 迭代元素个数
       * int getIndex(); 迭代元素当前索引
       * boolean getFirst(); 是否为第一个
       * boolean getEven(); 是否为偶
       * boolean getLast(); 是否最后一个
       * bolean getOdd();   是否为奇
       
       由于iteratorstatus对象并不是ognl的根对象因此访问需要加上 #访问如下例子:
     ```
           <s:iterator value="{'dd','bb','cc'}" status="st">
               <s:if test="#st.odd">
                   <s:property value="#st.index"/>
               </s:if>
           </s:iterator>
     ```
     
  3. `<s:form>`和`<s:file>`上传标签
  
     类似JSP中的`<form>`标签（例如上传文件，其中嵌套一个`<s:file>`标签，并以二进制流的方式处理表单数据，即设置`<s:form>`的enctype属性为 `multipart/form-data）`
     ```
         <s:form action="upload.action" method="post" entype="multipart/form-data">
             <s:file name="upload" label="Upload File"></s:file>
             <s:submit value="upload" />
         </s:form>
     ```
     
##Struts国际化1. 在src下新建一个struts.properties文件，并输入以下代码	     
       struts.custom.i18n.resources=资源文件名(例如messageResource)
         2. 新建两个资源文件，分别为中文和英文。首先，新建第一个英文资源文件`messageResource_en_US.properties`   ```   username=username   password=password   login=login   ```
   再新建一个中文的资源文件`messageResource_zh_CN.properties`(中文值为ASCII码)
   ```   username=\u7528\u6237\u540d   password=\u5bc6\u7801   login=\u767b\u5f55   ```  3. 新建jsp页面，在页面中使用国际化文件     ```       <s:textfield name="user.xh" key="username" />     <s:password name="user.pw" key ="password" />     <s:submit value="%{getText('login')}" />     ```
#Hibernate

##概念

###Hibernate概念

Hibernate是一个开放源代码的对象关系映射框架，它对JDBC进行了轻量级的封装（未完全封装），使Java程序员可以使用面向对象的编程思想来操纵数据库。

###ORM概念

ORM（对象/关系映射）是用于将对象与对象之间的关系对应到数据库表与表之间的关系的一种模式。Hibernate作为ORM中间件出现。

##Hibernate核心接口

* Configuration接口 **负责管理Hibernate的配置信息**
* SessionFactory接口 **负责创建Session实例**
* Session接口 **Hibernate持久化操作的基础，封装了一些持久化方法例如save、update**
* Transaction接口 **Hibernate进行事务操作的接口**
* Query接口 **执行HQL语句进行查询**

##HQL语言

###定义

HQL是Hibernate Query Language（Hibernate查询语言）。很像SQL语言，操作的对象是类、实例和属性。

###Hibernate关联映射

* 一对一关联
* 多对一单向关联
* 一对多双向关联
* 多对多关联

##Hibernate高级功能

###Hibernate批量插入

1. 修改Hibernate配置文件 `Hibernate.cfg.xml`:

   ```
          <hibername-configuration>
            <session-factory>
              ...
              <!-- 设置批量尺寸-->
              <property name="hibernate.jdbc.batch_size">50</property> 
              <!--配置数据库方言-->
              <property name="dialect">org.hibernate.dialect.MySQL</property> 
              <!--关闭二级缓存以提高速度-->
              <property name="hibernate.cache_use_second_level_cache">false</property>
            </session-factory>
          </hibername-configuration>
   ```
        
2. Java代码中模拟插入数据:

   ```
   Session session = HibernateSessionFactory.getSesstion();// 获得Session
   Transaction ts = session.beginTransaction();// 开始事务

   for (int i = 0;i < 500;i++) {
       Kcb kcb = new Kcb(); // 创建一个新课表
       kcb.setKch(i + ""); // 设置课程号（模拟）
       session.save(kcb); // 存储
       if (i % 50 == 0) {
           session.flush(); // 提交
           session.clear(); // 清除缓冲区
       }
   }
   ts.commit(); // 提交数据
   HibernateSessionFactory.closeSession(); // 关闭Session
   ```        

###Hibernate批量删除

1. 修改配置文件，添加查询翻译器属性。
2. Java代码中批量删除课程号大于200的课程
   ```
   Session session = HibernateSessionFactory.getSesstion();// 获得Session
   Transaction ts = session.beginTransaction();// 开始事务
   Query query = session.createQuery("delete from Kcb where kch>200");
   query.executeUpdate();
   ts.commit(); // 提交数据
   HibernateSessionFactory.closeSession(); // 关闭Session
   ```

###实体对象生命周期

* 瞬时态 **实体对象在内存中的存在 与数据库无关**
* 持久态 **Hibernate所管理的状态**
* 脱管状态 **Session实例关闭之后其管理对象的状态**

处于持久态的对象也称为PO(Persistence Object)，瞬时对象和脱管对象也称为VO（Value Object）。

###Hibernate事务管理

* 基于JDBC的事务管理
  
  Hibernate是JDBC的轻量级封装，本身不具备事务管理能力。在事务管理层，Hibernate将其委托给底层的JDBC或JTA，以实现事务管理和调度功能。
  
* 基于JTA的事务管理

  JTA(Java Transaction API)是由Java EE Transction Manager去管理事务。其最大的特点是调用UserTransaction接口的begin、commit和rollback方法来完成事务范围的界定、事务的提交和回滚。JTA可以实现统一事务对应不同的数据库。

###Hibernate锁机制

* 悲观锁 **对数据被外界修改持保守态度**
* 乐观锁 **认为数据很少发生同时存取的问题**

##Hibernate与Struts2整合

###DAO模式

* DAO概念：**Data Access Object，数据访问接口**
* DAO组件实现

###整合过程

1. 建立数据库及表结构
2. 在MyEclipse创建对数据库的连接
3. 创建Web项目
4. 添加Hibernate开发能力
5. 生成数据库表对应的Java对象和映射文件
6. `hibernate.cfg.xml`中注册映射文件，配置数据库属性
   ```
   <hibername-configuration>
    <session-factory>
        <property name="connection.username">[数据库用户名]</property>
        <property name="connection.password">[数据库密码]</property>
        <property name="connection.url">[数据库地址、数据库名、访问参数]</property>
        <property name="connection.driver_class">[数据库驱动]</property>
        <!-- 配置数据库方言 -->
        <property name=”dialect>org.hibernate.dialect.MySQL”</property>
        <!-- 注册Hibernate映射表 -->
        <mapping resource="com/model/Kcb.hbm.xml"/>
        ......
   </session-factory>
   </hibername-configuration> 
   ```
          
7. DAO层组件实现
8. 添加Struts类库，编写`struts.xml`文件。
9. 修改`web.xml`文件。

#Spring
##Spring概念

* Spring是一个开源框架
* 为了解决企业应用开发的复杂性而创建的

* 使用基本的Java Bean来完成以前只可能由EJB完成的事情
* 不仅限于服务端开发
* 简单性、可测试性和松耦合

##核心机制

* Spring的核心机制是依赖注入，也称为控制反转（IoC-DI，Inversion of Control-Dependency Inversion）。

* 工厂模式
  
  * 定义
    
    当应用程序中A组件需要B组件协助时，并不直接通过硬编码的方式来创建B组件的实例对象，而是根据需要，通过B对象的工厂类的生产方法来构造B的实例，这样可以降低A与B之间的耦合。
    
>*（理解）*例如书上179页~181页例子中，为了完成每个国家的人吃饭行走两件事，如果不使用工厂模式，代码实现应该是这样的（为了体现工厂模式的价值，加上Country1~9代表其他国家）：
        ```
        Human humen[] = new Human[11];
        Human humen[0] = new Chinese();
        Human humen[1] = new American();
        Human humen[2] = new Country1();
        ...(中间省略7个构造语句)
        Human humen[10] = new Country9();
        for (Human human:humen) {
            human.eat();
            human.walk();
        }
        ```
        
>而使用工厂模式下，代码是这样：
        ```
        String toCreate[] = new String{"Chinese", "American","Country1".....,"Country9"};
        Factory factory = new Factory();
        for (String countryName:toCreate) {
            Human human = factory.getHuman(countryName);
            human.eat();
            human.walk();
        }
        ```
        
>两段代码的作用是一样的，第一个例子加上中间省略的语句，实际上有效代码有16行，而第二个例子只有7行。两段代码最大的差别在于对象的构造部分，在使用中不需要逐个使用其构造器来构造对象，而是选择使用工厂来完成，从而降低了吃饭行走组件和具体每个国家的人的耦合性。
    
* Spring的依赖注入

  * 特点： 开发人员不用创建工厂，可以直接应用Spring提供的依赖注入方式。
  * 两种注入方式：
    * 设置注入
      
      通过setter方法注入被调用者的实例。
      
      1. 为属性设置setter方法
      2. 在配置文件中指定需要容器注入的属性
      
             <bean id="english" class="org.English"></bean>             <bean id="chinese" class="org.Chinese">		          <property name="lan" ref="english"></property>             </bean>
      
    * 构造注入
    
      1. 为Bean类添加一个构造注入所需要的带参数的构造方法
      2. 在配置文件里为bean设置构造注入（constructor-arg属性）
  
             <bean id="english" class="org.English"></bean>             <bean id="chinese" class="org.Chinese">                 <constructor-arg ref="english"></constructor-arg >             </bean>  
##Spring核心接口及基本配置

* 核心接口
  
  1. BeanFactory 创建和分发bean的通用工厂
  2. ApplicationContext（应用上下文）
     * 对国际化的支持
     * 提供载入资源的通用方法，如文本和图片
     * 可以向注册为监听器的Bean发送事件

* bean的基本配置
  
  * 配置格式
    
    格式：
    
        <bean id="[bean的id]" class="[bean完整类名]" />
    
    例如：
    
        <bean id="foo" class="com.spring.Foo" />    
        
##Spring 与 Struts 整合步骤

1. 创建项目
2. 添加Struts相关Jar包
3. 创建页面及其Action
4. 添加Spring框架支持包：`struts2-spring-plugin.jar`
5. 修改web.xml使程序增加对Spring的支持
   * 添加Spring的listener
   * 在context-param中配置ApplicationContext的路径   
6. *创建消息包文件 `struts.properties`* 内容为：
       
        struts.objectFactory=spring

##Spring 与 Hibernate 整合步骤

1. 建立数据库
2. 创建Web项目
3. 添加Spring开发能力
   
   * Spring 2.0 Core Libraries
   * Spring Web Libraries
   * Spring 2.0 AOP Libraries
   * Spring 2.0 Persistence JDBC Libraries
   
4. 加载Hibernate框架
5. 生成与数据库表对应的Java数据对象和映射
6. 编写DAO接口和实现类
7. 修改Spring配置文件
   * 数据库相关配置
   * Hibernate的SessionFactory配置
   * 注入DAO
   
8. Spring的Bean很好地管理了以前在hibernate.cfg.xml文件中创建SessionFactory，使文件更容易阅读
9. 编写测试类

##SSH 三种框架的整合

* SSH的层次划分
  
  1. Hibernate完成数据的持久层应用
  2. Spring来管理组件
  3. Struts完成页面跳转
  
* SSH中DAO的具体实现
  
  * find	查找学生方法
  * findAll	分页查找方法
  * save	插入方法
  * update	更新方法
  ```
        public class XsDaoImpl extends HibernateDaoSuppport implements XsDao{
            // 删除学生信息            public void delete(String xh){			     getHibernateTemplate().delete(find(xh));            }            // 查找学生信息            public Xsb find(String xh){                return getHibernateTemplate().find("from Xsb where xh=?", xh);            }
            // 查找所有学生信息            public List<Xsb> findAll() {
                return getHibernateTemplate().find("from Xsb");;            }            // 添加学生信息            public void save(Xch xch){                return getHibernateTemplate().save(xch);            }            // 修改学生信息            public void update(Xch xch){    	        getHibernateTemplate().update(xch);            }        }  ```
#Ajax
##概述

Ajax不是一种全新的技术，它是几种技术的融合：

* *HTML/XHTML* 实现页面内容的表示
* *CSS* 格式化文本内容
* *DOM* 对页面内容进行动态更新
* *XML* 实现数据交换和格式转换
* *XMLHttpRequest* 实现与服务器异步通信
* *JavaScript* 实现以上技术的融合

特点：

* 必须是客户端和服务器一同合作的应用程序
* JavaScript是撰写Ajax应用程序的客户端语言
* XML是请求或回应时建议使用的交换信息的格式

##JavaScript浏览器对象

* `window`对象
  
  window对象描述*浏览器窗口*的特征。它可以认为是任何对象的假定父对象
  
* `Document`对象

  Document表示浏览器窗口或者其中一个框架中显示的*HTML文档*。
  
* `History`对象

  history对象包含用户已经*浏览过的URL集合*。
  
##XMLHttpRequest对象

* XMLHttpRequest概述和特点

  XMLHttpRequest对象提供客户端与HTTP服务器异步通信的协议。通过它Ajax可以像桌面应用一样只同服务器进行数据层交换，而不必每次都刷新页面。（减轻服务器负担，加快响应速度）

* 获得XMLHttpRequest的方法
  ```
      var xmlHttp;   
      function createXMLHttpRequest() {
          if (window.XMLHttpRequest) {
              // Firefox、Safari、Chrome下获取XMLHttpRequest对象的方法
              xmlHttp = new XMLHttpRequest();
          }
          else {
              // IE下获得XMLHttpRequest的方法
              xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
          }
      }
   ```
      
##DWR
###概述和特点

DWR是类似于Hibernate的开源框架。借助DWR开发人员无需具备专业的JavaScript知识就可以轻松实现Ajax，使Ajax应用更加“平民化”。

###使用方法

* 导入 DWR 的Jar包
* 在web.xml中添加DWR的servlet映射
* 添加dwr.xml文件来配置那些Java类可以被DWR应用创建并远程调用。

 
   
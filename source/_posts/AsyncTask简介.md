title: AsyncTask简介
tags: [Android]
date: 2015-04-15 20:05:47

---

AsyncTask enables proper and easy use of the UI thread. This class allows to perform background operations and publish results on the UI thread without having to manipulate threads and/or handlers.

<a id="more"></a>

AsyncTask is designed to be a helper class around Thread and Handler and does not constitute a generic threading framework. AsyncTasks should ideally be used for short operations (a few seconds at the most.) If you need to keep threads running for long periods of time, it is highly recommended you use the various APIs provided by the java.util.concurrent package such as Executor, ThreadPoolExecutor and FutureTask.

An asynchronous task is defined by a computation that runs on a background thread and whose result is published on the UI thread. An asynchronous task is defined by 3 generic types, called Params, Progress and Result, and 4 steps, called onPreExecute, doInBackground, onProgressUpdate and onPostExecute.

* * *

> 蹩脚翻译 仅供参考

* * *

AsyncTask 能使 UI 线程的使用变得恰当和简单。这个类允许 UI 线程在不操纵 Thread 和/或 Handler 的情况下执行后台操作和发布结果。

AsyncTask 被设计成为一个围绕 Thread 和 Handler 工作的帮助类，并且不会形成一个普通的线程框架。AsyncTask 理想中应该被用于短操作（大多是几秒）。如果你需要保持线程运行很长时间，推荐你使用 java.util.concurrent 包提供的许多类比如 Executor、ThreadPoolExecutor 和 FutureTask。

一个 AsyncTask 被定义为一个运行在后台线程并且结果公布给 UI 线程的运算。AsyncTask 定义了三个泛型：Params、Progress 和 Result 以及四个步骤：onPreExecute、doInBackground、onProgressUpdate 和 onPostExecute。

* * *

以上摘自 Google 官方文档 。

之前一直使用 Handler+Thread 来完成各种异步操作，昨天参加南京 GDG 这边组织的 Android Study Jam 介绍了一下 AsyncTask 的用法，惭愧于之前一直没有使用正确的姿势来学习 Android，养成了各种不规范的习惯。

在 AsyncTask 中，三个泛型分别代表着：

*   Params：创建时被传入的参数
*   Progress：执行过程中需要及时反馈给 UI 的进度
*   Result：任务执行结束后的结果

四个方法分别表示：

*   onPreExecute：执行前的准备工作。一般用于初始化 UI
*   doInbackground：后台任务
*   onProgressUpdate：进度更新给 UI
*   onPostExecute：返回结果

下面是一个小 demo 来演示一下最基础的 AsyncTask 用法：

#### MainActivity.java
<figure class="highlight scala"><table><tr><td class="gutter"><pre><span class="line">1</span>
<span class="line">2</span>
<span class="line">3</span>
<span class="line">4</span>
<span class="line">5</span>
<span class="line">6</span>
<span class="line">7</span>
<span class="line">8</span>
<span class="line">9</span>
<span class="line">10</span>
<span class="line">11</span>
<span class="line">12</span>
<span class="line">13</span>
<span class="line">14</span>
<span class="line">15</span>
<span class="line">16</span>
<span class="line">17</span>
<span class="line">18</span>
<span class="line">19</span>
<span class="line">20</span>
<span class="line">21</span>
<span class="line">22</span>
<span class="line">23</span>
<span class="line">24</span>
<span class="line">25</span>
<span class="line">26</span>
<span class="line">27</span>
<span class="line">28</span>
<span class="line">29</span>
<span class="line">30</span>
<span class="line">31</span>
<span class="line">32</span>
<span class="line">33</span>
<span class="line">34</span>
<span class="line">35</span>
<span class="line">36</span>
<span class="line">37</span>
<span class="line">38</span>
<span class="line">39</span>
<span class="line">40</span>
<span class="line">41</span>
<span class="line">42</span>
<span class="line">43</span>
<span class="line">44</span>
<span class="line">45</span>
<span class="line">46</span>
<span class="line">47</span>
<span class="line">48</span>
<span class="line">49</span>
<span class="line">50</span>
</pre></td><td class="code"><pre><span class="line"><span class="keyword">import</span> android.app.<span class="type">Activity</span>;</span>
<span class="line"><span class="keyword">import</span> android.os.<span class="type">AsyncTask</span>;</span>
<span class="line"><span class="keyword">import</span> android.os.<span class="type">Bundle</span>;</span>
<span class="line"><span class="keyword">import</span> android.os.<span class="type">SystemClock</span>;</span>
<span class="line"><span class="keyword">import</span> android.widget.<span class="type">ProgressBar</span>;</span>
<span class="line"><span class="keyword">import</span> android.widget.<span class="type">TextView</span>;</span>
<span class="line"></span>
<span class="line">public <span class="class"><span class="keyword">class</span> <span class="title">MainActivity</span> <span class="keyword"><span class="keyword">extends</span></span> <span class="title">Activity</span> &#123;</span></span>
<span class="line"></span>
<span class="line">    <span class="type">ProgressBar</span> pb_main;</span>
<span class="line">    <span class="type">TextView</span> tv_result;</span>
<span class="line"></span>
<span class="line">    <span class="annotation">@Override</span></span>
<span class="line">    <span class="keyword">protected</span> void onCreate(<span class="type">Bundle</span> savedInstanceState) &#123;</span>
<span class="line">        <span class="keyword">super</span>.onCreate(savedInstanceState);</span>
<span class="line">        setContentView(<span class="type">R</span>.layout.activity_main);</span>
<span class="line"></span>
<span class="line">        pb_main = (<span class="type">ProgressBar</span>) findViewById(<span class="type">R</span>.id.pb_main);</span>
<span class="line">        tv_result = (<span class="type">TextView</span>) findViewById(<span class="type">R</span>.id.tv_main);</span>
<span class="line"></span>
<span class="line">        <span class="type">TestTask</span> task = <span class="keyword">new</span> <span class="type">TestTask</span>();</span>
<span class="line">        task.execute();</span>
<span class="line">    &#125;</span>
<span class="line"></span>
<span class="line">    <span class="keyword">private</span> <span class="class"><span class="keyword">class</span> <span class="title">TestTask</span> <span class="keyword"><span class="keyword">extends</span></span> <span class="title">AsyncTask&lt;Void</span>, <span class="title">Integer</span>, <span class="title">String&gt;</span> &#123;</span></span>
<span class="line"></span>
<span class="line">        <span class="annotation">@Override</span></span>
<span class="line">        <span class="keyword">protected</span> <span class="type">String</span> doInBackground(<span class="type">Void</span>... params) &#123;</span>
<span class="line"></span>
<span class="line">            int progress = <span class="number">0</span>;</span>
<span class="line">            <span class="keyword">while</span> (progress &lt; <span class="number">100</span>) &#123;</span>
<span class="line">                <span class="type">SystemClock</span>.sleep(<span class="number">100</span>);</span>
<span class="line">                progress++;</span>
<span class="line">                publishProgress(progress);</span>
<span class="line">            &#125;</span>
<span class="line">            <span class="keyword">return</span> <span class="string">"任务完成"</span> + progress;</span>
<span class="line">        &#125;</span>
<span class="line"></span>
<span class="line">        <span class="annotation">@Override</span></span>
<span class="line">        <span class="keyword">protected</span> void onProgressUpdate(<span class="type">Integer</span>... values) &#123;</span>
<span class="line">            pb_main.setProgress(values[<span class="number">0</span>]);</span>
<span class="line">            tv_result.setText(<span class="string">"任务进度："</span> + values[<span class="number">0</span>] + <span class="string">""</span>);</span>
<span class="line">        &#125;</span>
<span class="line"></span>
<span class="line">        <span class="annotation">@Override</span></span>
<span class="line">        <span class="keyword">protected</span> void onPostExecute(<span class="type">String</span> s) &#123;</span>
<span class="line">            tv_result.setText(s);</span>
<span class="line">        &#125;</span>
<span class="line">    &#125;</span>
<span class="line">&#125;</span>
</pre></td></tr></table></figure>

#### activity_main.xml
<figure class="highlight nix"><table><tr><td class="gutter"><pre><span class="line">1</span>
<span class="line">2</span>
<span class="line">3</span>
<span class="line">4</span>
<span class="line">5</span>
<span class="line">6</span>
<span class="line">7</span>
<span class="line">8</span>
<span class="line">9</span>
<span class="line">10</span>
<span class="line">11</span>
<span class="line">12</span>
<span class="line">13</span>
<span class="line">14</span>
<span class="line">15</span>
<span class="line">16</span>
<span class="line">17</span>
<span class="line">18</span>
<span class="line">19</span>
<span class="line">20</span>
<span class="line">21</span>
<span class="line">22</span>
<span class="line">23</span>
<span class="line">24</span>
<span class="line">25</span>
</pre></td><td class="code"><pre><span class="line">&lt;RelativeLayout xmlns:<span class="variable">android=</span><span class="string">"http://schemas.android.com/apk/res/android"</span></span>
<span class="line">    xmlns:<span class="variable">tools=</span><span class="string">"http://schemas.android.com/tools"</span></span>
<span class="line">    android:<span class="variable">layout_width=</span><span class="string">"match_parent"</span></span>
<span class="line">    android:<span class="variable">layout_height=</span><span class="string">"match_parent"</span></span>
<span class="line">    tools:<span class="variable">context=</span><span class="string">".MainActivity"</span>&gt;</span>
<span class="line">    </span>
<span class="line">    &lt;TextView</span>
<span class="line">        android:<span class="variable">padding=</span><span class="string">"20dp"</span></span>
<span class="line">        android:<span class="variable">id=</span><span class="string">"@+id/tv_main"</span></span>
<span class="line">        android:<span class="variable">layout_width=</span><span class="string">"match_parent"</span></span>
<span class="line">        android:<span class="variable">layout_height=</span><span class="string">"wrap_content"</span></span>
<span class="line">        android:<span class="variable">text=</span><span class="string">"@string/progress_info"</span></span>
<span class="line">        android:<span class="variable">layout_alignParentTop=</span><span class="string">"true"</span></span>
<span class="line">        android:<span class="variable">layout_centerHorizontal=</span><span class="string">"true"</span> /&gt;</span>
<span class="line">    </span>
<span class="line">    &lt;ProgressBar</span>
<span class="line">        android:<span class="variable">id=</span><span class="string">"@+id/pb_main"</span></span>
<span class="line">        <span class="variable">style=</span><span class="string">"?android:attr/progressBarStyleHorizontal"</span></span>
<span class="line">        android:<span class="variable">layout_width=</span><span class="string">"match_parent"</span></span>
<span class="line">        android:<span class="variable">layout_height=</span><span class="string">"wrap_content"</span></span>
<span class="line">        android:<span class="variable">layout_centerVertical=</span><span class="string">"true"</span></span>
<span class="line">        android:<span class="variable">layout_alignParentLeft=</span><span class="string">"true"</span></span>
<span class="line">        android:<span class="variable">layout_alignParentStart=</span><span class="string">"true"</span> /&gt;</span>
<span class="line">        </span>
<span class="line">&lt;/RelativeLayout&gt;</span>
</pre></td></tr></table></figure>
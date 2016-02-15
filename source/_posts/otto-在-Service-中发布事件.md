title: otto 在 Service 中发布事件

date: 2015-10-09 20:49:35

tags: [Android, RxJava, RxAndroid]

----

otto 是 square 开发的一个 event bus 类库，项目地址：https://github.com/square/otto

在使用 otto 在 service 中发布 event 时，会抛出没有在主线程调用的异常，对于这个问题 StackOverflow 上给出解决的代码，解决思路是定义一个主线程的 handler，如果当前不在主线程，则通过这个 handler post 一个事件。代码如下：

``` java
public class MainThreadBus extends Bus {
	private final Handler mHandler = new Handler(Looper.getMainLooper());

 	@Override
	public void post(final Object event) {
	if (Looper.myLooper() == Looper.getMainLooper()) {
        super.post(event);
	} else {
		mHandler.post(new Runnable() {
			@Override
    	public void run() {
      	MainThreadBus.super.post(event);
    	}
		});
	}
}
```

如果你恰好和我一样使用了 RxAndroid 的话，它提供了更为方便的调度器（Scheduler）来完成这个操作，我是这样实现的：

``` java
public static void post(final Object event) {
	Observable.just(event).observeOn(AndroidSchedulers.mainThread())
                .subscribe(postEvent -> EventBus.get().post(postEvent));
}
```

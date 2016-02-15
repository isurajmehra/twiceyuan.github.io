title: Retrofit 1.9 迁移到 Retrofit 2.0
date: 2015-12-26 13:43:17
tags: [Android]

---

retrofit 2.0 已经进入 beta2，看了[泡神的文章](http://www.jcodecraeer.com/a/anzhuokaifa/androidkaifa/2015/0915/3460.html)说已基本没什么坑了，准备把自己的项目也迁移过来，发现需要改变的东西还不少，单是看依赖就多了一堆，这里把一些变动的地方整理一下。

<!--more-->

## 变化

### Retrofit 

gradle

    compile 'com.squareup.retrofit:retrofit:2.0.0-beta2'


还是原来的包名，final String 目前最新版本是 = "beta2"。
RestAdapter 类名已不再使用，定义用 Retrofit 就可以了。

    Retrofit retrofit = new Retrofit.Builder().build();

### okHttp -> null

OkHttpClient 已经自动被 Retrofit 依赖，不需要再单独声明。

```
Retrofit retrofit = new Retrofit.Builder()
  .client(new OkHttpClient())
  .build();
```

### GsonConvertor

gradle

    compile 'com.squareup.retrofit:converter-gson:2.0.0-beta2' 

```
Retrofit retrofit = new Retrofit.Builder()
  .addConverterFactory(GsonConverterFactory.create())
  .build();
```

### Log

在 1.9版本里，控制日志打印只要 setLogLevel 就可以了。但是 2.0 需要在 OkHttpClient 里通过 interceptor 配置，别怕已经有现成轮子可用：

gradle

    compile 'com.squareup.okhttp:logging-interceptor:2.7.0'


配置（在 OkHttpClient 对象上）

```
client.interceptors().add(new HttpLoggingInterceptor(new HttpLoggingInterceptor.DEFAULT));
```

### 添加请求头方法

由于retrofit 本身不再提供 interceptor 定制，这个功能也转移到了 OkHttp：

```
client.interceptors().add(new Interceptor() {
    @Override
    public Response intercept(Chain chain) throws IOException {
        Request newRequest = chain.request().newBuilder()
                .addHeader("platform", "android")
                .addHeader("appVersion", BuildConfig.VERSION_NAME)
                .build();
        return chain.proceed(newRequest);
    }
});
```

### RxJava

如果想使用 rx.Observable 作为请求结果，可以配置 CallAdapter，依赖是需要添加一个依赖：

gradle

    compile 'com.squareup.retrofit:adapter-rxjava:2.0.0-beta2'

```
Retrofit retrofit = new Retrofit.Builder()
  .addCallAdapterFactory(RxJavaCallAdapterFactory.create())
  .build();
```

## 完整版本

### Dependenies

```gradle
dependenies {
    // ...
    compile 'com.squareup.retrofit:retrofit:2.0.0-beta2' // retrofit
    compile 'io.reactivex:rxandroid:1.1.0' // rxjava extensions
    compile 'com.orhanobut:logger:1.11' // print pretty Log
    compile 'com.google.code.gson:gson:2.5' // gson
    compile 'com.squareup.retrofit:converter-gson:2.0.0-beta2' // gson convertor with retrofit
    compile 'com.squareup.retrofit:adapter-rxjava:2.0.0-beta2' // rxjava extension with retrofit
    compile 'com.squareup.okhttp:logging-interceptor:2.7.0' // filter request and response log with okHttpClient
}
```

### Setup Code

```Java
OkHttpClient client = new OkHttpClient();

// set time out interval
client.setReadTimeout(10, TimeUnit.MINUTES);
client.setConnectTimeout(10, TimeUnit.MINUTES);
client.setWriteTimeout(10, TimeUnit.MINUTES);

// print Log
client.interceptors().add(new HttpLoggingInterceptor(new HttpLoggingInterceptor.Logger() {
    @Override
    public void log(String message) {
        if (message.startsWith("{")) {
            Logger.json(message);
        } else {
            Logger.i("Api", message);
        }
    }
}));

// add custom headers
client.interceptors().add(new Interceptor() {
    @Override
    public Response intercept(Chain chain) throws IOException {
        Request newRequest = chain.request().newBuilder()
                .addHeader("platform", "android")
                .addHeader("appVersion", BuildConfig.VERSION_NAME)
                .build();
        return chain.proceed(newRequest);
    }
});

Retrofit.Builder builder = new Retrofit.Builder()
        .client(client) // setup okHttp client
        .addConverterFactory(GsonConverterFactory.create(gson)) // GSON converter
        .addCallAdapterFactory(RxJavaCallAdapterFactory.create()); // RxCallAdapter

// multiple service
service = builder.baseUrl("").build().create(GistApi.class);
```

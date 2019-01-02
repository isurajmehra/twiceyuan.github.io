title: Android appcompat-v7 兼容包导致 MENU 按键不能监听到的解决方案
tags: [Android]
date: 2015-05-07 08:24:06

---

在使用 com.android.support:appcompat-v7 版本 21 以上，并且 Activity 继承 ActionBarActivity 或者 AppCompactActivity 时，会发现 onKeyDown() 方法和 onKeyUp() 方法均获取不到菜单键 (MENU) 的点击事件。

经过搜索，应该是 v7兼容包的问题，解决方案如下：

<!--more-->

创建类 AppCompatActivityMenuKeyInterceptor，代码如下：
```java
import android.support.v7.app.AppCompatActivity;
import android.support.v7.internal.view.WindowCallbackWrapper;
import android.view.KeyEvent;
import android.view.Window;

import java.lang.ref.WeakReference;
import java.lang.reflect.Field;

public class AppCompatActivityMenuKeyInterceptor {

    private static final String FIELD_NAME_DELEGATE = “mDelegate”;
    private static final String FIELD_NAME_WINDOW = “mWindow”;

    public static void intercept(AppCompatActivity appCompatActivity) {
        new AppCompatActivityMenuKeyInterceptor(appCompatActivity);
    }

    private AppCompatActivityMenuKeyInterceptor(AppCompatActivity activity) {
        try {
            Field mDelegateField = AppCompatActivity.class.getDeclaredField(FIELD_NAME_DELEGATE);
            mDelegateField.setAccessible(true);
            Object mDelegate = mDelegateField.get(activity);

            Field mWindowField = mDelegate.getClass().getSuperclass().getSuperclass().getDeclaredField(FIELD_NAME_WINDOW);
            mWindowField.setAccessible(true);
            Window mWindow = (Window) mWindowField.get(mDelegate);

            Window.Callback mOriginalWindowCallback = mWindow.getCallback();
            mWindow.setCallback(new AppCompatWindowCallbackCustom(mOriginalWindowCallback, activity));
        } catch (NoSuchFieldException e) {
            e.printStackTrace();
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        }
    }

    private class AppCompatWindowCallbackCustom extends WindowCallbackWrapper {

        private WeakReference<AppCompatActivity> mActivityWeak;

        public AppCompatWindowCallbackCustom(Window.Callback wrapped, AppCompatActivity appCompatActivity) {
            super(wrapped);

            mActivityWeak = new WeakReference<AppCompatActivity>(appCompatActivity);
        }

        @Override
        public boolean dispatchKeyEvent(KeyEvent event) {
            final int keyCode = event.getKeyCode();
            final int action = event.getAction();

            AppCompatActivity appCompatActivity = mActivityWeak.get();

            if (appCompatActivity != null) {
                if (keyCode == KeyEvent.KEYCODE_MENU && action == KeyEvent.ACTION_DOWN) {
                    if (mActivityWeak.get().onKeyDown(event.getKeyCode(), event))
                        return true;
                } else if (keyCode == KeyEvent.KEYCODE_MENU && action == KeyEvent.ACTION_UP) {
                    if (mActivityWeak.get().onKeyUp(event.getKeyCode(), event))
                        return true;
                }
            }

            return super.dispatchKeyEvent(event);
        }
    }
}
```
并且在需要监听菜单键的 Activity 的 onCreate 方法中调用，调用方法为：

    AppCompatActivityMenuKeyInterceptor.intercept(this);

参考来源：

1.  [Issue 159795:    KEYCODE_MENU is broken on appcompat 22.0.0](https://code.google.com/p/android/issues/detail?id=159795)
2.  [Upgraded to AppCompat v22.1.0 and now onKeyDown and onKeyUp are not triggered when menu key is pressed](http://stackoverflow.com/questions/29852303/upgraded-to-appcompat-v22-1-0-and-now-onkeydown-and-onkeyup-are-not-triggered-wh/29852304#29852304)

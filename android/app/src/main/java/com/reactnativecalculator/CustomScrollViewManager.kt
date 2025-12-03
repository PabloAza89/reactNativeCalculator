package com.reactnativecalculator

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.views.scroll.ReactScrollView
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.ReadableArray

import android.util.Log
import android.view.View
import android.os.Build
import android.graphics.drawable.LayerDrawable
import android.util.TypedValue
import android.content.res.Resources
import android.graphics.drawable.Drawable

import androidx.core.content.ContextCompat

import java.lang.reflect.Field
import java.lang.reflect.Method

class CustomScrollViewManager(reactContext: ReactApplicationContext) : ViewGroupManager<ReactScrollView>() {
  override fun getName(): String = "RCTScrollView"

  fun dpToPx(dp: Double): Int = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, dp.toFloat(), Resources.getSystem().displayMetrics).toInt()

  override fun createViewInstance(reactContext: ThemedReactContext): ReactScrollView = ReactScrollView(reactContext)

  override fun receiveCommand(view: ReactScrollView, commandId: Int, args: ReadableArray?) = view.smoothScrollTo(0, 0)

  fun setReflectionScrollbarThumbDrawable(view: View, drawable: Drawable) {
    try {
      val mScrollCacheField: Field = View::class.java.getDeclaredField("mScrollCache")
      mScrollCacheField.isAccessible = true
      val mScrollCache: Any? = mScrollCacheField.get(view)
      val scrollBarField: Field = mScrollCache!!::class.java.getDeclaredField("scrollBar")
      scrollBarField.isAccessible = true
      val scrollBar: Any? = scrollBarField.get(mScrollCache)
      val method: Method = scrollBar!!::class.java.getDeclaredMethod("setVerticalThumbDrawable", Drawable::class.java)
      method.isAccessible = true
      method.invoke(scrollBar, drawable)
    } catch (e: Exception) {
      e.printStackTrace()
    }
  }

  @ReactProp(name = "scrollbarPadding")
  fun setDrawableScrollbar(view: ReactScrollView, map: ReadableMap) {
    val layerDrawable = ContextCompat.getDrawable(view.context, R.drawable.thumb) as LayerDrawable
    layerDrawable.setLayerInset(0, dpToPx(map.getDouble("left")), dpToPx(map.getDouble("top")), dpToPx(map.getDouble("right")), dpToPx(map.getDouble("bottom")))
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) { view.setVerticalScrollbarThumbDrawable(layerDrawable) } // 10 = setVerticalScrollbarThumbDrawable
    else { setReflectionScrollbarThumbDrawable(view, layerDrawable) } // reflection
    view.scrollBy(0, 1) // RE-RENDER HELPER
    view.scrollBy(0, -1) // RE-RENDER HELPER
  }

  @ReactProp(name = "persistentScrollbar")
  fun setPersistentScrollbar(view: ReactScrollView, value: Boolean) {
    view.setScrollbarFadingEnabled(!value)
    view.scrollBy(0, 1) // RE-RENDER HELPER
    view.scrollBy(0, -1) // RE-RENDER HELPER
  }
}
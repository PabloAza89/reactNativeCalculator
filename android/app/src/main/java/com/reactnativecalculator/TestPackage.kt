package com.reactnativecalculator // replace your-app-name with your app’s name

import android.view.View
import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ReactShadowNode
import com.facebook.react.uimanager.ViewManager
import android.util.Log

 class TestPackage : ReactPackage {
    override fun createViewManagers(
      reactContext: ReactApplicationContext
    ): MutableList<ViewManager<View, ReactShadowNode<*>>> = mutableListOf()

    // override fun createNativeModules(
    //   reactContext: ReactApplicationContext
    // ): MutableList<NativeModule> = listOf(TestModule(reactContext)).toMutableList()

    override fun createNativeModules(
        reactContext: ReactApplicationContext
    ): MutableList<NativeModule> {
        // 💡 Check 2: See if the createNativeModules function is called
        //Log.d("LOG", "ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ")
        return mutableListOf(TestModule(reactContext))
    }

  }
package com.reactnativecalculator

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.LifecycleEventListener
import com.facebook.react.modules.core.DeviceEventManagerModule

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactMethod
import android.util.Log
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableNativeMap

import android.os.Handler
import android.os.Looper

//import com.facebook.react.modules.core.DeviceEventManagerModule

class TestModule(reactContext: ReactApplicationContext): ReactContextBaseJavaModule(reactContext) {

    // init {
    //     // 💡 Check 1: See if the constructor is called
    //     Log.d("LOG", "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    // }

    override fun getName(): String = "TestModule"

    val contextTest = reactContext

    
    // @ReactMethod
    // fun asdasd() {
    //   contextTest.emitDeviceEvent("LayoutInfo", "TEST RESPONSE FROM MODULE 111")
    // }

    // asdasd()

    @ReactMethod
    fun addListener(eventName: String) { }

    @ReactMethod
    fun removeListeners(count: Int) { }

    fun emitInitializationEvent(message: String) {

        val payload: WritableMap = WritableNativeMap()
        payload.putString("detail", message)
        

        Log.d("LOG", "PRE-MESSAGE REACHED................")

        // reactApplicationContext
        //     .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
        //     .emit("LayoutInfo", payload)

        Handler(Looper.getMainLooper()).post {
        try {
            reactApplicationContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit("LayoutInfo", payload)
            
            Log.d("LOG", "SUCCESS: Event emitted on Main Thread.")
            
        } catch (e: Exception) {
            // Check Logcat for this error!
            Log.e("LOG", "ERROR emitting event: ${e.message}") 
        }
    }
        //reactApplicationContext.emitDeviceEvent("LayoutInfo", "TEST RESPONSE FROM MODULE 111")
        //reactApplicationContext.emitDeviceEvent("LayoutInfo", message)
        //contextTest.emitDeviceEvent("LayoutInfo", message)
        //reactHost?.currentReactContext?.emitDeviceEvent("LayoutInfo", message)
        // contextTest
        //     .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
        //     .emit("LayoutInfo", "TEST message");
        
    }

    @ReactMethod
    fun testFunc(promise: Promise) {
      
      try {
        //let asd = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
        promise.resolve("AASDASDASDASDASD") // OK
        Log.d("LOG", "TEST LOG TEST LOG TEST LOG")

        Log.d("LOG", "TEST LOG TEST LOG TEST LOG: $this.reactContext")

        //reactContext.emitDeviceEvent("LayoutInfo", "TEST RESPONSE FROM MODULE")
        //contextTest.emitDeviceEvent("LayoutInfo", "TEST RESPONSE FROM MODULE")
        //reactHost?.currentReactContext?.emitDeviceEvent("LayoutInfo", "TEST RESPONSE FROM ELSE")
        //reactHost?.currentReactContext?.emitDeviceEvent("LayoutInfo", "TEST RESPONSE FROM MODULE")

        contextTest.emitDeviceEvent("LayoutInfo", "TEST RESPONSE FROM MODULE 222")
        // contextTest
        //   ?.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
        //   ?.emit("LayoutInfo", "TEST RESPONSE FROM MODULE");

        //promise.resolve("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA") // OK
        //this.toggleDualScreenMode()
        //promise.resolve((activity as MainActivity).getString())
        //promise.resolve((activity as MainActivity).toggleDualScreenMode())
        //(activity as MainActivity).toggleDualScreenMode()
        //(activity as MainActivity).toggleDualScreenMode2()
      } catch (e: Exception) {
          promise.reject(e)
          // pickerPromise?.reject(E_FAILED_TO_SHOW_PICKER, t)
          // pickerPromise = null
      }
    }

    // companion object {
    //     const val IMAGE_PICKER_REQUEST = 1
    //     const val E_ACTIVITY_DOES_NOT_EXIST = "E_ACTIVITY_DOES_NOT_EXIST"
    //     const val E_PICKER_CANCELLED = "E_PICKER_CANCELLED"
    //     const val E_FAILED_TO_SHOW_PICKER = "E_FAILED_TO_SHOW_PICKER"
    //     const val E_NO_IMAGE_DATA_FOUND = "E_NO_IMAGE_DATA_FOUND"
    // }

}
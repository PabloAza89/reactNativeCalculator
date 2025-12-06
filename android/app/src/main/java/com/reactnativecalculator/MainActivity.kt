package com.reactnativecalculator

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

import android.os.Bundle
import com.zoontek.rnbootsplash.RNBootSplash
import com.reactnativecalculator.R
import androidx.core.view.WindowCompat
import kotlinx.coroutines.Dispatchers
import kotlin.properties.Delegates
import android.view.View
import android.graphics.Rect
import androidx.lifecycle.lifecycleScope
import androidx.lifecycle.repeatOnLifecycle
import androidx.lifecycle.Lifecycle
import androidx.window.layout.WindowInfoTracker
import android.util.Log
import kotlinx.coroutines.launch
import android.os.Build
import kotlinx.coroutines.Job
import androidx.window.layout.WindowLayoutInfo
import com.facebook.react.bridge.Arguments
import androidx.window.layout.WindowMetricsCalculator
import androidx.window.layout.FoldingFeature
import android.content.res.Configuration
import androidx.annotation.RequiresApi
import android.view.WindowInsets
import kotlin.math.min
//import com.facebook.react.ReactInstanceManager.ReactInstanceEventListener
import com.facebook.react.bridge.ReactContext
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.facebook.react.turbomodule.core.interfaces.TurboModule

import com.facebook.react.ReactInstanceEventListener

//import com.facebook.react.modules.core.DeviceEventManagerModule;

//import com.facebook.react.ReactInstanceManager

//import com.facebook.react.ReactInstanceManager.ReactInstanceEventListener

import com.facebook.react.ReactPackage
import com.facebook.react.uimanager.ReactShadowNode
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

import android.app.Activity

import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.NativeModule

import com.reactnativecalculator.TestModule

//class MainActivity : ReactActivity() , ReactInstanceManager.ReactInstanceEventListener {
//class MainActivity : ReactActivity(), ReactInstanceEventListener {
class MainActivity: ReactActivity() {

  var canUpdate: Boolean = true // 1st FLAG (MANUAL or AUTO UPDATE)
  var sendUpdate: Boolean = false
  var dotsPerInch: Double by Delegates.notNull<Double>()
  var currentMaxHorizontalInset: Int by Delegates.notNull<Int>()
  var currentMaxVerticalInset: Int by Delegates.notNull<Int>()
  lateinit var rootView: View
  //private val lock = Any()
  lateinit var currentOrientation: String // UI retrigger
  lateinit var currentState: String // UI retrigger
  lateinit var currentInsets: Rect // UI retrigger
  var currentWindow: MutableMap<String, Int> = mutableMapOf() // UI retrigger
  var currentHingeBounds: MutableMap<String, Int> = mutableMapOf() // UI retrigger

  override fun onCreate(savedInstanceState: Bundle?) {
    RNBootSplash.init(this, R.style.Start); // Initialize SplashScreen
    super.onCreate(null); // super.onCreate(savedInstanceState) // super.onCreate(null) with react-native-screens
    //super.onCreate(savedInstanceState)
    WindowCompat.setDecorFitsSystemWindows(window, false)
    val mainActivity = this@MainActivity
    dotsPerInch = mainActivity.resources.displayMetrics.density.toDouble() // Float --> Double
    rootView = findViewById<View>(android.R.id.content).rootView

    lifecycleScope.launch(Dispatchers.Main) {
      lifecycle.repeatOnLifecycle(Lifecycle.State.STARTED) {
        WindowInfoTracker.getOrCreate(mainActivity)
          .windowLayoutInfo(mainActivity)
          .collect { newLayoutInfo ->
            Log.d("LOG", "AppLock.canUpdate auto " + canUpdate)
            if (canUpdate) {canUpdate = false;updateUI(newLayoutInfo)} // BLOCK 1st FLAG ASAP
          }
      }
    }

  }

  fun updateUI(incomingWindowLayoutInfo: WindowLayoutInfo?) { //manual: Boolean
    Log.d("LOG", "incomingWindowLayoutInfo: " + incomingWindowLayoutInfo)
    Log.d("LOG", "currentInsets: " + ::currentInsets.isInitialized)
    //canUpdate = false // FLAG FOR updateUI()

    // VALUES
    val mainActivity = this@MainActivity
    val multiWindow = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) mainActivity.isInMultiWindowMode else false // MULTI-WINDOW (24)
    var job: Job? = null
    val mainMap = Arguments.createMap()
    var newHingeBounds: MutableMap<String, Int> = mutableMapOf()
    lateinit var newState: String
    lateinit var newInsets: Rect
    val windowBounds = WindowMetricsCalculator.getOrCreate().computeCurrentWindowMetrics(mainActivity).bounds

    // val newOrientation = mainActivity.resources.configuration.orientation
    // if (newOrientation == Configuration.ORIENTATION_PORTRAIT) { currentOrientation = "portrait" }
    // else { currentOrientation = "landscape" }

    // // BEGIN INSETS //
    // @RequiresApi(Build.VERSION_CODES.R)
    // fun getInsetsCompatR(rootView: View): Unit {
    //   val preNewInsets = rootView.rootWindowInsets?.getInsets(
    //     WindowInsets.Type.statusBars() or
    //     WindowInsets.Type.displayCutout() or
    //     WindowInsets.Type.navigationBars() or
    //     WindowInsets.Type.captionBar()
    //   )
    //   if (preNewInsets !== null) newInsets = Rect(preNewInsets.left, preNewInsets.top, preNewInsets.right, preNewInsets.bottom)
    // }
    // @RequiresApi(Build.VERSION_CODES.M)
    // fun getInsetsCompatM(rootView: View): Unit {
    //   val ppreNewInsets = rootView.rootWindowInsets
    //   if (ppreNewInsets !== null) newInsets = Rect(ppreNewInsets.systemWindowInsetLeft, ppreNewInsets.systemWindowInsetTop, ppreNewInsets.systemWindowInsetRight, min(ppreNewInsets.systemWindowInsetBottom, ppreNewInsets.stableInsetBottom))
    // }
    // if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) getInsetsCompatR(rootView) // 11 to newest..
    // else getInsetsCompatM(rootView) // 6 to 10
    // // 5 or older NOT SUPPORTED

    // END INSETS //

    fun getOrHandleWindowLayoutInfo(windowLayoutInfo: WindowLayoutInfo, manualJob: Boolean) { // get or handle WindowLayoutInfo
      Log.d("LOG", "DATA: " + windowLayoutInfo + ", MANUAL JOB: " + manualJob)
      if (manualJob) job?.cancel(); // CANCEL CURRENT, IF ANY, JOB

      // NEW VALUES //
      val foldingFeature = windowLayoutInfo.displayFeatures.filterIsInstance<FoldingFeature>().firstOrNull()
      val newOrientation = if (mainActivity.resources.configuration.orientation == Configuration.ORIENTATION_PORTRAIT) "portrait" else "landscape"
      val newWindow = mutableMapOf("width" to windowBounds.width(), "height" to windowBounds.height())



      // BEGIN INSETS //
      @RequiresApi(Build.VERSION_CODES.R)
      fun getInsetsCompatR(rootView: View): Unit {
        val preNewInsets = rootView.rootWindowInsets?.getInsets(
          WindowInsets.Type.statusBars() or
          WindowInsets.Type.displayCutout() or
          WindowInsets.Type.navigationBars() or
          WindowInsets.Type.captionBar()
        )
        if (preNewInsets !== null) newInsets = Rect(preNewInsets.left, preNewInsets.top, preNewInsets.right, preNewInsets.bottom)
      }
      @RequiresApi(Build.VERSION_CODES.M)
      fun getInsetsCompatM(rootView: View): Unit {
        val preNewInsets = rootView.rootWindowInsets
        if (preNewInsets !== null) newInsets = Rect(preNewInsets.systemWindowInsetLeft, preNewInsets.systemWindowInsetTop, preNewInsets.systemWindowInsetRight, min(preNewInsets.systemWindowInsetBottom, preNewInsets.stableInsetBottom))
      }
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) getInsetsCompatR(rootView) // 11 to newest..
      else getInsetsCompatM(rootView) // 6 to 10
      // 5 or older NOT SUPPORTED

      // // BEGIN INSETS //
      // @RequiresApi(Build.VERSION_CODES.R)
      // fun getInsetsCompatR(rootView: View): Unit {
      //   val newInsets =
      //     rootView.rootWindowInsets?.getInsets(
      //       WindowInsets.Type.statusBars() or
      //       WindowInsets.Type.displayCutout() or
      //       WindowInsets.Type.navigationBars() or
      //       WindowInsets.Type.captionBar()
      //     )

      //   if (newInsets !== null) {
      //     currentInsets = Rect(newInsets.left, newInsets.top, newInsets.right, newInsets.bottom)
      //     sendUpdate = true
      //   }
      // }

      // @RequiresApi(Build.VERSION_CODES.M)
      // fun getInsetsCompatM(rootView: View): Unit {
      //   val preInsets = rootView.rootWindowInsets
      //   if (preInsets !== null) {
      //     currentInsets = Rect(preInsets.systemWindowInsetLeft, preInsets.systemWindowInsetTop, preInsets.systemWindowInsetRight, min(preInsets.systemWindowInsetBottom, preInsets.stableInsetBottom))
      //     sendUpdate = true
      //   }
      // }

      // if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) getInsetsCompatR(rootView) // 11 to newest..
      // else getInsetsCompatM(rootView) // 6 to 10
      // // 5 or older NOT SUPPORTED

      // // BEGIN VERTICAL & HORIZONTAL INSET //
      // if (currentInsets.left > currentInsets.right) currentMaxHorizontalInset = currentInsets.left
      // else currentMaxHorizontalInset = currentInsets.right
      // if (currentInsets.top > currentInsets.bottom) currentMaxVerticalInset = currentInsets.top
      // else currentMaxVerticalInset = currentInsets.bottom
      // // END VERTICAL & HORIZONTAL INSET //

      

      //var newHingeBounds: MutableMap<String, Int> = mutableMapOf()
      //lateinit var newState: String



      // sendUpdate FLAG SETTERS
      if (!::currentOrientation.isInitialized || !currentOrientation.equals(newOrientation)) { currentOrientation = newOrientation; sendUpdate = true }
      if (currentWindow.isEmpty() || !currentWindow.equals(newWindow)) { currentWindow = newWindow; sendUpdate = true }
      if (!::currentInsets.isInitialized || !currentInsets.equals(newInsets)) { currentInsets = newInsets; sendUpdate = true }

      if (foldingFeature != null) { // DEVICE IS FOLDABLE
        newHingeBounds = mutableMapOf(
          "left" to foldingFeature.bounds.left,
          "top" to foldingFeature.bounds.top,
          "right" to foldingFeature.bounds.right,
          "bottom" to foldingFeature.bounds.bottom
        )

        newState =
          if ((foldingFeature.state == FoldingFeature.State.FLAT && foldingFeature.occlusionType == FoldingFeature.OcclusionType.NONE) || multiWindow) "flat"
          else if (foldingFeature.orientation == FoldingFeature.Orientation.HORIZONTAL) "tabletop"
          else "book"
      } else { // DEVICE IS NOT FOLDABLE
        newState = currentOrientation
        newHingeBounds = mutableMapOf("left" to 0, "top" to 0, "right" to 0, "bottom" to 0)
      }

      // BEGIN VERTICAL & HORIZONTAL INSET //
      if (currentInsets.left > currentInsets.right) currentMaxHorizontalInset = currentInsets.left
      else currentMaxHorizontalInset = currentInsets.right
      if (currentInsets.top > currentInsets.bottom) currentMaxVerticalInset = currentInsets.top
      else currentMaxVerticalInset = currentInsets.bottom
      // END VERTICAL & HORIZONTAL INSET //

      if (!::currentState.isInitialized || !currentState.equals(newState)) { currentState = newState; sendUpdate = true }

      if (currentHingeBounds.isEmpty() || !currentHingeBounds.equals(newHingeBounds)) { currentHingeBounds = newHingeBounds; sendUpdate = true }

      sendUpdate = true

      Log.d("LOG", "PRE SEND-UPDATE VAL: " + sendUpdate)

      if (sendUpdate) {
        Log.d("LOG", "SEND-UPDATE CALLED")
        mainMap.putMap("hingeBounds", Arguments.createMap().apply {
          putDouble("left", currentHingeBounds["left"]!! / dotsPerInch)
          putDouble("top", currentHingeBounds["top"]!! / dotsPerInch)
          putDouble("right", currentHingeBounds["right"]!! / dotsPerInch)
          putDouble("bottom", currentHingeBounds["bottom"]!! / dotsPerInch)
        });
        mainMap.putString("state", currentState); // flat, tabletop..
        mainMap.putMap("window", Arguments.createMap().apply {
          putDouble("width", currentWindow["width"]!! / dotsPerInch)
          putDouble("height", currentWindow["height"]!! / dotsPerInch)
        });
        mainMap.putMap("insets", Arguments.createMap().apply {
          putDouble("left", currentInsets.left / dotsPerInch)
          putDouble("top", currentInsets.top / dotsPerInch)
          putDouble("right", currentInsets.right / dotsPerInch)
          putDouble("bottom", currentInsets.bottom / dotsPerInch)
        });
        mainMap.putDouble("maxHorizontalInset", currentMaxHorizontalInset / dotsPerInch)
        mainMap.putDouble("maxVerticalInset", currentMaxVerticalInset / dotsPerInch)
        mainMap.putDouble("vmin",
          if (currentWindow["width"]!! > currentWindow["height"]!!) (currentWindow["height"]!! / dotsPerInch) / 100
          else (currentWindow["width"]!! / dotsPerInch) / 100
        );
        mainMap.putBoolean("tallBar", if (currentInsets.left / dotsPerInch > 47 || currentInsets.right / dotsPerInch > 47 || currentInsets.bottom / dotsPerInch > 47) true else false);

        //if (reactInstanceManager.currentReactContext == null) {
        //if (1 == 1) {
        //Log.d("LOG", "TEST TEST TEST " + reactHost?.currentReactContext) // work

        // reactHost.onHostResume(reactHost?.currentReactContext) {
        //     Log.d("LOG", "00000000: " + reactHost.currentReactContext)
        //   }

        val rrr = reactHost.currentReactContext
        if (rrr == null) {
          Log.d("LOG", "111111111111111111")

          //mainMap.putString("state", "portrait")
          //this@MainActivity.reactNativeHost.reactInstanceManager.currentReactContext
          //this@MainActivity.reactNativeHost.reactInstanceManager

          //this@MainActivity.reactHost.addReactInstanceEventListener(object: ReactInstanceEventListener {
          //this@MainActivity.reactNativeHost.reactInstanceManager.addReactInstanceEventListener(object: ReactInstanceEventListener {


          val listener = object : ReactInstanceEventListener {
              override fun onReactContextInitialized(context: ReactContext) {
                  Log.d("LOG", "111111111111111111 INNER")
                  context.emitDeviceEvent("LayoutInfo", "TEST RESPONSE FROM 111111111111111111111111")
                  reactHost.removeReactInstanceEventListener(this)
              }
          }
          reactHost.addReactInstanceEventListener(listener)

          // reactHost.addReactInstanceEventListener(object: ReactInstanceEventListener {
          //   override fun onReactContextInitialized(context: ReactContext) {
          //       Log.d("LOG", "111111111111111111 INNER")
                
          //       reactHost?.currentReactContext?.emitDeviceEvent("LayoutInfo", "TEST RESPONSE FROM 111111111111111111111111")
          //       // // this@MainActivity.reactHost.currentReactContext
          //       // context
          //       //   ?.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
          //       //   ?.emit("LayoutInfo", "asdasdsadasd")
          //       //   //?.emit("LayoutInfo", mainMap)

          //       //reactHost?.currentReactContext?.emitDeviceEvent("LayoutInfo", "TEST RESPONSE")
          //       // reactHost?.currentReactContext
          //       //   ?.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
          //       //   ?.emit("LayoutInfo", "TEST RESPONSE");
          //       //reactHost?.currentReactContext?.emitDeviceEvent("LayoutInfo", "TEST RESPONSE")
          //       //context.emitDeviceEvent("LayoutInfo", "TEST RESPONSE")
          //       //getReactInstanceManager().getCurrentReactContext()?.emitDeviceEvent("LayoutInfo", "TEST RESPONSE")
          //   }
          // })

          //reactHost?.currentReactContext?.emitDeviceEvent("LayoutInfo", "TEST RESPONSE")
          // reactHost.currentReactContext
          //   ?.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
          //   ?.emit("LayoutInfo", "TEST RESPONSE FROM 1111111111111111111")
          //reactHost?.currentReactContext?.emitDeviceEvent("LayoutInfo", "TEST RESPONSE")
          //getReactInstanceManager().getCurrentReactContext()?.emitDeviceEvent("LayoutInfo", "TEST RESPONSE")
         //reactHost?.currentReactContext?.emitDeviceEvent("LayoutInfo", "TEST RESPONSE FROM 1111111111111111111")

        } else {
          Log.d("LOG", "222222222222222222")
          //reactHost?.currentReactContext?.emitDeviceEvent("LayoutInfo", mainMap)
          //reactHost?.currentReactContext?.emitDeviceEvent("LayoutInfo", "TEST RESPONSE")
          // reactHost?.currentReactContext
          //   ?.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
          //   ?.emit("LayoutInfo", "TEST RESPONSE");
          rrr.emitDeviceEvent("LayoutInfo", "TEST RESPONSE FROM 222222222222222222")
          //getReactInstanceManager().getCurrentReactContext()?.emitDeviceEvent("LayoutInfo", "TEST RESPONSE")
        }
        //   

        //   //Log.d("LOG", "111111111111111111: " + reactHost.addReactInstanceEventListener) // maybe..

        //   // reactHost.currentReactContext
        //   //   ?.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
        //   //   ?.emit("LayoutInfo", mainMap)

        //   //this@MainActivity.reactNativeHost.reactInstanceManager.currentReactContext
        //   //this@MainActivity.reactNativeHost.reactInstanceManager.addReactInstanceEventListener(object: ReactInstanceEventListener {
        //   // this@MainActivity.reactHost.addReactInstanceEventListener(object: ReactInstanceEventListener {
        //   //   override fun onReactContextInitialized(context: ReactContext) {
        //   //       Log.d("LOG", "111111111111111111 INNER")
        //   //       //context
        //   //       this@MainActivity.reactHost.currentReactContext
        //   //         ?.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
        //   //         ?.emit("LayoutInfo", mainMap)
        //   //   }
        //   // })
        //   // reactHost.addReactInstanceEventListener(object: ReactInstanceEventListener {
        //   //   // reactHost?.currentReactContext
        //   //   //     ?.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
        //   //   //     ?.emit("LayoutInfo", mainMap)
        //   //   override fun onReactContextInitialized(context: ReactContext) {

        //   //     Log.d("LOG", "111111111111111111 INNER")

        //   //     // Log.d("LOG", "111111111111111111: " + reactHost.currentReactContext)
        //   //     // Log.d("LOG", "111111111111111111: " + reactHost.lifecycleState)
        //   //     //Log.d("LOG", "111111111111111111: $context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)")
        //   //     //Log.d("LOG", "111111111111111111: $reactHost?.currentReactContext?.emitDeviceEvent("LayoutInfo", mainMap)")

        //   //     // reactHost?.currentReactContext
        //   //     //   ?.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
        //   //     //   ?.emit("LayoutInfo", mainMap)
        //   //       // ?.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
        //   //       // ?.emit("LayoutInfo", mainMap)

        //   //     //reactHost?.currentReactContext?.emitDeviceEvent("LayoutInfo", mainMap) // Don't know why does not work..

        //   //     // Log.d("LOG", "111111111111111111: $reactHost.reactInstanceManager" )
        //   //     // Log.d("LOG", "111111111111111111: $reactHost.reactInstanceManager.currentReactContext" )
        //   //     Log.d("LOG", "111111111111111111 1: $reactHost" ) // CALL OK
        //   //     Log.d("LOG", "111111111111111111 2: $this.reactHost" ) // CALL OK
        //   //     Log.d("LOG", "111111111111111111 3: $this.reactNativeHost" ) // CALL OK
        //   //     //Log.d("LOG", "111111111111111111 4: $reactNativeHost" ) // NO CALL !!
        //   //     //this@MainActivity.reactNativeHost.reactInstanceManager.currentReactContext
        //   //     this@MainActivity.reactNativeHost.reactInstanceManager.currentReactContext
        //   //       ?.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
        //   //       ?.emit("LayoutInfo", mainMap)

        //   //     //Log.d("LOG", "INS 111111111111111111 Context ID: " + context)
        //   //     //reactActivityDelegate.reactHost?.currentReactContext
        //   //     // context
        //   //     //   .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
        //   //     //   .emit("LayoutInfo", mainMap)
        //   //     // Log.d("LOG", "FIN 111111111111111111: " + context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java))
        //   //     // context
        //   //     //   .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
        //   //     //   .emit("LayoutInfo", mainMap)
        //   //     // reactActivityDelegate.reactHost?.currentReactContext
        //   //     //   ?.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
        //   //     //   ?.emit("LayoutInfo", mainMap)
        //   //   }
        //   // })



        // } else {
        //   Log.d("LOG", "2222222222222222")
        //   //Log.d("LOG", "2222222222222222 : " + reactActivityDelegate.reactHost?.currentReactContext)
        //   //Log.d("LOG", "2222222222222222222: $reactHost.currentReactContext?.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)")
        //   // reactHost?.currentReactContext
        //   //   ?.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
        //   //   ?.emit("LayoutInfo", mainMap)
        //   //Log.d("LOG", "2222222222222222222: $reactHost?.currentReactContext?.emitDeviceEvent("LayoutInfo", mainMap)")
        //   reactHost?.currentReactContext?.emitDeviceEvent("LayoutInfo", mainMap)
        // }

        // if (reactInstanceManager.currentReactContext == null) { // NOT WORKING
        //   Log.d("LOG", "111111111111111111")
        //   reactInstanceManager.addReactInstanceEventListener(object: ReactInstanceEventListener {
        //     override fun onReactContextInitialized(context: ReactContext) {
        //       context
        //         .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
        //         ?.emit("LayoutInfo", mainMap)
        //     }
        //   })
        // } else {
        //   Log.d("LOG", "2222222222222222")
        //   reactInstanceManager.currentReactContext
        //     ?.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
        //     ?.emit("LayoutInfo", mainMap)
        // }
        sendUpdate = false // RESET UPDATE FLAG
      }
      canUpdate = true // FLAG FOR updateUI()
    } // END OF updateUI()

    if (incomingWindowLayoutInfo != null) getOrHandleWindowLayoutInfo(incomingWindowLayoutInfo, false) // AUTO FOLDING FEATURE INFO
    else {
    Log.d("LOG", "LAUNCHED MANUAL JOB")
      job?.cancel(); // CANCEL PREVIOUS, IF ANY, JOB
      job = lifecycleScope.launch { // MANUAL FOLDING FEATURE INFO
        WindowInfoTracker.getOrCreate(mainActivity)
          .windowLayoutInfo(mainActivity)
          .collect { getOrHandleWindowLayoutInfo(it, true) }
      };
    }
  }

  override fun onConfigurationChanged(newConfig: Configuration) {
    super.onConfigurationChanged(newConfig)
    
    Log.d("LOG", "CONFIGURATION HAS CHANGED")
    //updateUI(null) // manual
    //synchronized(AppLock.lock) {
      //if (canUpdate) {canUpdate = false;updateUI(null)}
      Log.d("LOG", "AppLock.canUpdate oCC " + canUpdate)
      if (canUpdate) {canUpdate = false;updateUI(null)} // BLOCK 1st FLAG ASAP
    //}
 
  }

  // override fun onReactContextInitialized(casontext: ReactContext) {
  //   //Log.d("LOG", "BBBBBBBBBBBBBBBBBBBBBBBBBBB: $context")
  //   Log.d("LOG", "LOG LOG LOG")
  //   Log.d("LOG", "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
  // }

  override fun onResume() {
        super.onResume()

        val listener = object : ReactInstanceEventListener {
            override fun onReactContextInitialized(context: ReactContext) {
                Log.d("LOG", "4444444444 newer test")
                reactHost.removeReactInstanceEventListener(this)
            }
        }
        reactHost.addReactInstanceEventListener(listener)
  }

  // class TestPackage : ReactPackage {
  //   override fun createViewManagers(
  //     reactContext: ReactApplicationContext
  //   ): MutableList<ViewManager<View, ReactShadowNode<*>>> = mutableListOf()

  //   override fun createNativeModules(
  //     reactContext: ReactApplicationContext
  //   ): MutableList<NativeModule> = listOf(TestModule(reactContext)).toMutableList()
  // }

  // class TestModule(reactContext: ReactApplicationContext): ReactContextBaseJavaModule(reactContext) {
  //   override fun getName(): String = "TestModule"

  //   val contextTest = reactContext

    
  //   // @ReactMethod
  //   // fun asdasd() {
  //   //   contextTest.emitDeviceEvent("LayoutInfo", "TEST RESPONSE FROM MODULE 111")
  //   // }

  //   // asdasd()

  //   @ReactMethod
  //   fun addListener(eventName: String) { }

  //   @ReactMethod
  //   fun removeListeners(count: Int) { }

  //   fun emitInitializationEvent(message: String) {
        
  //       // Use the inherited context property
  //       // reactApplicationContext
  //       //     .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
  //       //     .emit("TestInitializationEvent", message) 

  //       //reactApplicationContext.emitDeviceEvent("LayoutInfo", "TEST RESPONSE FROM MODULE 111")
  //       reactApplicationContext.emitDeviceEvent("LayoutInfo", message)
            
        
  //   }

  //   @ReactMethod
  //   fun testFunc(promise: Promise) {
      
  //     try {
  //       //let asd = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
  //       promise.resolve("AASDASDASDASDASD") // OK
  //       Log.d("LOG", "TEST LOG TEST LOG TEST LOG")

  //       Log.d("LOG", "TEST LOG TEST LOG TEST LOG: $this.reactContext")

  //       //reactContext.emitDeviceEvent("LayoutInfo", "TEST RESPONSE FROM MODULE")
  //       //contextTest.emitDeviceEvent("LayoutInfo", "TEST RESPONSE FROM MODULE")
  //       //reactHost?.currentReactContext?.emitDeviceEvent("LayoutInfo", "TEST RESPONSE FROM ELSE")
  //       //reactHost?.currentReactContext?.emitDeviceEvent("LayoutInfo", "TEST RESPONSE FROM MODULE")

  //       contextTest.emitDeviceEvent("LayoutInfo", "TEST RESPONSE FROM MODULE 222")
  //       // contextTest
  //       //   ?.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
  //       //   ?.emit("LayoutInfo", "TEST RESPONSE FROM MODULE");

  //       //promise.resolve("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA") // OK
  //       //this.toggleDualScreenMode()
  //       //promise.resolve((activity as MainActivity).getString())
  //       //promise.resolve((activity as MainActivity).toggleDualScreenMode())
  //       //(activity as MainActivity).toggleDualScreenMode()
  //       //(activity as MainActivity).toggleDualScreenMode2()
  //     } catch (e: Exception) {
  //         promise.reject(e)
  //         // pickerPromise?.reject(E_FAILED_TO_SHOW_PICKER, t)
  //         // pickerPromise = null
  //     }
  //   }
  // }

  override fun getMainComponentName(): String = "reactNativeCalculator"

  override fun createReactActivityDelegate(): ReactActivityDelegate =
    DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}

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
import com.facebook.react.bridge.ReactContext
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.facebook.react.turbomodule.core.interfaces.TurboModule

import com.facebook.react.ReactInstanceEventListener

import com.facebook.react.ReactPackage
import com.facebook.react.uimanager.ReactShadowNode
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

import android.app.Activity

import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.NativeModule

import com.facebook.react.ReactRootView

import kotlin.random.Random

import android.graphics.Color

import androidx.core.view.ViewCompat

class MainActivity: ReactActivity() {

  var canUpdate: Boolean = true // 1st FLAG (MANUAL or AUTO UPDATE)
  var sendUpdate: Boolean = false
  var dotsPerInch: Double by Delegates.notNull<Double>()
  var currentMaxHorizontalInset: Int by Delegates.notNull<Int>()
  var currentMaxVerticalInset: Int by Delegates.notNull<Int>()
  //lateinit var rootView: View
  lateinit var decorViewRef: View
  lateinit var contentViewRef: View
  lateinit var currentOrientation: String // UI retrigger
  lateinit var currentState: String // UI retrigger
  lateinit var currentInsets: Rect // UI retrigger
  var currentWindow: MutableMap<String, Int> = mutableMapOf() // UI retrigger
  var currentHingeBounds: MutableMap<String, Int> = mutableMapOf() // UI retrigger


  //var lastInsets: WindowInsets? = null
  //var currentInsetsToString: String? = null
  //var currentInsetsRef: String? = null
  var currentInsetsRef: Rect? = null
  var currentOrientationRef: String? = null
  //var currentOrientationRef: Int? = null
  //lateinit var currentInsetsRef: Rect // UI retrigger
  var testCurrentOrientation: Int? = null

  var userLaunched: Boolean = true // when onCreate is called due 3-Button to Gesture (or vice-versa), don't send events to TS side.

  override fun onCreate(savedInstanceState: Bundle?) {
    //Log.d("LOG", "BUNDLE BUNDLE BUNDLE BUNDLE BUNDLE: " + savedInstanceState)
    if (savedInstanceState == null) userLaunched = true else userLaunched = false
    Log.d("LOG", "USER LAUNCHED: " + userLaunched)
    RNBootSplash.init(this, R.style.Start); // Init SplashScreen
    super.onCreate(null); // null with react-native-screens else savedInstanceState
    WindowCompat.setDecorFitsSystemWindows(window, false)
    val mainActivity = this@MainActivity
    dotsPerInch = mainActivity.resources.displayMetrics.density.toDouble() // Float --> Double
    //rootView = findViewById<View>(android.R.id.content).rootView // no work ?
    //rootView = findViewById<View>(android.R.id.content) // work

    contentViewRef = findViewById<View>(android.R.id.content)
    decorViewRef = contentViewRef.rootView
    

    //ViewCompat.setOnApplyWindowInsetsListener(rootView) { view, insets ->
    //rootView.setOnApplyWindowInsetsListener { view, insets ->
    contentViewRef.setOnApplyWindowInsetsListener { view, insets ->
    //decorView.setOnApplyWindowInsetsListener { view, insets ->

      //val newInsets = insets.toString()
      val decorView = view.rootView.rootWindowInsets // decorView
      var newInsetsRef: Rect? = null
      //val newOrientationRef = if (mainActivity.resources.configuration.orientation == Configuration.ORIENTATION_PORTRAIT) "portrait" else "landscape"
      val newOrientationRef = if (mainActivity.resources.configuration.orientation == Configuration.ORIENTATION_PORTRAIT) "portrait" else "landscape"

      Log.d("LOG", "lastInsets outer: " + insets)

      if (decorView !== null) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) { // 11 to newest.. ~ 30 to 36..
          val ins = decorView.getInsets(WindowInsets.Type.systemBars() or WindowInsets.Type.displayCutout())
          newInsetsRef = Rect(ins.left, ins.top, ins.right, ins.bottom)
        } else { // 7 to 10 ~ 24 to 29
          newInsetsRef = Rect(decorView.systemWindowInsetLeft, decorView.systemWindowInsetTop, decorView.systemWindowInsetRight, min(decorView.systemWindowInsetBottom, decorView.stableInsetBottom))
        }

        Log.d("LOG", "lastInsets inner: " + newInsetsRef)

        //if ((!newInsetsRef.equals(currentInsetsRef) || !newOrientationRef.equals(currentOrientationRef)) && canUpdate) { canUpdate = false; updateUI(null) } // BLOCK 1st FLAG ASAP //
        if ((!newInsetsRef.equals(currentInsetsRef) || !newOrientationRef.equals(currentOrientationRef)) && canUpdate) { canUpdate = false; updateUI(null) } // BLOCK 1st FLAG ASAP
        //canUpdate = false; updateUI(null)
        currentInsetsRef = newInsetsRef
        currentOrientationRef = newOrientationRef
      }

      // if (decorViewInner !== null) {
      //   val newInsetsRef = Rect(decorViewInner.systemWindowInsetLeft, decorViewInner.systemWindowInsetTop, decorViewInner.systemWindowInsetRight, min(decorViewInner.systemWindowInsetBottom, decorViewInner.stableInsetBottom))
      //   Log.d("LOG", "lastInsets outer: " + newInsetsRef)
      //   if (!newInsetsRef.equals(currentInsetsRef)) {
      //     Log.d("LOG", "lastInsets inner: " + newInsetsRef)
      //     if (canUpdate) {canUpdate = false;updateUI(null)} // BLOCK 1st FLAG ASAP
      //   }
      //   currentInsetsRef = newInsetsRef
      // }

      insets
    }

    contentViewRef.requestApplyInsets()


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

  //var lastInsets: WindowInsets? = null

  fun doApplyInsets(insets: WindowInsets) {
    // Use the passed-in 'insets' object, which is guaranteed to be current.
    // val left = insets.systemWindowInsetLeft
    // val top = insets.systemWindowInsetTop
    // val right = insets.systemWindowInsetRight
    // val bottom = min(insets.systemWindowInsetBottom, insets.stableInsetBottom)

    // newInsets = Rect(left, top, right, bottom)

    // // Log the new values (convert to DP if needed, assuming your 'dotsPerInch' is for that conversion)
    // Log.d("LOG", "INSETS APPLIED left: " + left / dotsPerInch)
    // Log.d("LOG", "INSETS APPLIED top: " + top / dotsPerInch)
    // Log.d("LOG", "INSETS APPLIED right: " + right / dotsPerInch)
    // Log.d("LOG", "INSETS APPLIED bottom: " + bottom / dotsPerInch)

    // You can call your updateUI here, or a simplified version
    // updateUI(null) 
    //Log.d("LOG", "ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ")

    // if (insets == lastInsets) {
    //     // Insets geometry is identical, skip layout pass
    //     Log.d("LOG", "ZZZZZ - Insets identical, skipping")
    //     return 
    // }
    // lastInsets = insets

    //Log.d("LOG", "ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ")

}

  fun updateUI(incomingWindowLayoutInfo: WindowLayoutInfo?) {
    Log.d("LOG", "incomingWindowLayoutInfo: " + incomingWindowLayoutInfo)
    Log.d("LOG", "currentInsets: " + ::currentInsets.isInitialized)
    //canUpdate = false // FLAG FOR updateUI() execution

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
      //val newOrientation = if (mainActivity.resources.configuration.orientation == Configuration.ORIENTATION_PORTRAIT) "portrait" else "landscape"
      val newOrientation = if (mainActivity.resources.configuration.orientation == Configuration.ORIENTATION_LANDSCAPE) "landscape" else "portrait"
      val newWindow = mutableMapOf("width" to windowBounds.width(), "height" to windowBounds.height())



      // BEGIN INSETS //
      @RequiresApi(Build.VERSION_CODES.R)
      fun getInsetsCompatR(rootView: View): Unit {
        val preNewInsets = rootView.rootWindowInsets?.getInsets(WindowInsets.Type.systemBars() or WindowInsets.Type.displayCutout())
        if (preNewInsets != null) newInsets = Rect(preNewInsets.left, preNewInsets.top, preNewInsets.right, preNewInsets.bottom)
      }
      @RequiresApi(Build.VERSION_CODES.M)
      fun getInsetsCompatM(rootView: View): Unit {
        val preNewInsets = rootView.rootWindowInsets
        //if (preNewInsets != null) newInsets = Rect(preNewInsets.systemWindowInsetLeft, preNewInsets.systemWindowInsetTop, preNewInsets.systemWindowInsetRight, min(preNewInsets.systemWindowInsetBottom, preNewInsets.stableInsetBottom))
        if (preNewInsets != null) {
          // Log.d("LOG", "AAAAAAAAAAAAAAAAAAAAAAAAA: " + preNewInsets.systemWindowInsetBottom)
          // Log.d("LOG", "BBBBBBBBBBBBBBBBBBBBBBBBB: " + preNewInsets.stableInsetBottom)
          newInsets = Rect(preNewInsets.systemWindowInsetLeft, preNewInsets.systemWindowInsetTop, preNewInsets.systemWindowInsetRight, min(preNewInsets.systemWindowInsetBottom, preNewInsets.stableInsetBottom))
          // Log.d("LOG", "VALUE VALUE VALUE 00 left: " + preNewInsets.systemWindowInsetLeft / dotsPerInch)
          // Log.d("LOG", "VALUE VALUE VALUE 00 top: " + preNewInsets.systemWindowInsetTop / dotsPerInch)
          // Log.d("LOG", "VALUE VALUE VALUE 00 right: " + preNewInsets.systemWindowInsetRight / dotsPerInch)
          // Log.d("LOG", "VALUE VALUE VALUE 00 bottom: " + min(preNewInsets.systemWindowInsetBottom, preNewInsets.stableInsetBottom) / dotsPerInch)
        }
      }
      // if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) getInsetsCompatR(rootView) // 11 to newest.. // 30 to "36"
      // else getInsetsCompatM(rootView) // 7 to 10 // 24 to 29
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) getInsetsCompatR(decorViewRef) // 11 to newest.. // 30 to "36"
      else getInsetsCompatM(decorViewRef) // 7 to 10 // 24 to 29
      //else getInsetsCompatM(findViewById<View>(android.R.id.content).rootView) // 7 to 10 // 24 to 29
      //else getInsetsCompatM(rootView) // 7 to 10 // 24 to 29
      // 6 or older NOT SUPPORTED

      // sendUpdate FLAG SETTERS // TEST ORIGINAL
      if (!::currentOrientation.isInitialized || !currentOrientation.equals(newOrientation)) { currentOrientation = newOrientation; sendUpdate = true }
      // sendUpdate FLAG SETTERS // TEST ORIGINAL

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

      // BEGIN sendUpdate SETTERS //
      if (!::currentState.isInitialized || !currentState.equals(newState)) { currentState = newState; sendUpdate = true }
      if (currentHingeBounds.isEmpty() || !currentHingeBounds.equals(newHingeBounds)) { currentHingeBounds = newHingeBounds; sendUpdate = true }
      if (currentWindow.isEmpty() || !currentWindow.equals(newWindow)) { currentWindow = newWindow; sendUpdate = true }
      if (!::currentInsets.isInitialized || !currentInsets.equals(newInsets)) { currentInsets = newInsets; sendUpdate = true }
      // END sendUpdate SETTERS //

      // BEGIN VERTICAL & HORIZONTAL INSET //
      if (currentInsets.left > currentInsets.right) currentMaxHorizontalInset = currentInsets.left
      else currentMaxHorizontalInset = currentInsets.right
      if (currentInsets.top > currentInsets.bottom) currentMaxVerticalInset = currentInsets.top
      else currentMaxVerticalInset = currentInsets.bottom
      // END VERTICAL & HORIZONTAL INSET //

      Log.d("LOG", "PRE SEND-UPDATE VAL: " + sendUpdate)

      sendUpdate = true // TEST

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

        mainMap.putBoolean("tallNav", if (currentInsets.left / dotsPerInch > 47 || currentInsets.right / dotsPerInch > 47 || currentInsets.bottom / dotsPerInch > 47) true else false);

        //Log.d("LOG", "VALUE VALUE VALUE: " + mainMap.getBoolean("tallNav"))

        if (mainMap.getBoolean("tallNav")) window.setNavigationBarColor(Color.parseColor("#33000000")) // light-gray
        else window.setNavigationBarColor(Color.parseColor("#00000000")) // transparent black

        // if (mainMap.getBoolean("tallNav")) this@MainActivity.window.setNavigationBarColor(Color.parseColor("#33000000")) // light-gray
        // else this@MainActivity.window.setNavigationBarColor(Color.parseColor("#00000000")) // transparent black

        // if (mainMap.getBoolean("tallNav")) contentView.window.setNavigationBarColor(Color.parseColor("#33000000")) // light-gray
        // else contentView.window.setNavigationBarColor(Color.parseColor("#00000000")) // transparent black

        Log.d("LOG", "VALUE VALUE VALUE 0 ALL: " + mainMap.getMap("insets"))
        // Log.d("LOG", "VALUE VALUE VALUE 1 left: " + mainMap.getMap("insets")?.getBoolean("left"))
        // Log.d("LOG", "VALUE VALUE VALUE 1 top: " + mainMap.getMap("insets")?.getBoolean("top"))
        // Log.d("LOG", "VALUE VALUE VALUE 1 right: " + mainMap.getMap("insets")?.getBoolean("right"))
        // Log.d("LOG", "VALUE VALUE VALUE 1 bottom: " + mainMap.getMap("insets")?.getBoolean("bottom"))

        val currentContext = reactHost.currentReactContext
        if (currentContext == null) {
          val listener = object: ReactInstanceEventListener {
            override fun onReactContextInitialized(context: ReactContext) {
              //Log.d("LOG", "tallNav VALUE FROM 1: " + mainMap.getBoolean("tallNav"))
              // Log.d("LOG", "VALUE VALUE VALUE 1 left: " + mainMap.getMap("insets")?.getBoolean("left"))
              // Log.d("LOG", "VALUE VALUE VALUE 1 top: " + mainMap.getMap("insets")?.getBoolean("top"))
              // Log.d("LOG", "VALUE VALUE VALUE 1 right: " + mainMap.getMap("insets")?.getBoolean("right"))
              // Log.d("LOG", "VALUE VALUE VALUE 1 bottom: " + mainMap.getMap("insets")?.getBoolean("bottom"))
              context.emitDeviceEvent("LayoutInfo", mainMap)
              reactHost.removeReactInstanceEventListener(this)
            }
          }
          reactHost.addReactInstanceEventListener(listener)
        } else {
          //Log.d("LOG", "tallNav VALUE FROM 2: " + mainMap.getBoolean("tallNav"))
          // Log.d("LOG", "VALUE VALUE VALUE 2 left: " + mainMap.getMap("insets")?.getBoolean("left"))
          // Log.d("LOG", "VALUE VALUE VALUE 2 top: " + mainMap.getMap("insets")?.getBoolean("top"))
          // Log.d("LOG", "VALUE VALUE VALUE 2 right: " + mainMap.getMap("insets")?.getBoolean("right"))
          // Log.d("LOG", "VALUE VALUE VALUE 2 bottom: " + mainMap.getMap("insets")?.getBoolean("bottom"))
          currentContext.emitDeviceEvent("LayoutInfo", mainMap)
        }
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

    // if (newConfig.orientation == Configuration.ORIENTATION_LANDSCAPE) {
    //   // landscape config
    //   testCurrentOrientation = Configuration.ORIENTATION_LANDSCAPE
    // } else {
    //   // else is portrait
    //   testCurrentOrientation = Configuration.ORIENTATION_PORTRAIT
    //   }
    // }

    // when (newConfig.orientation) {
    //   Configuration.ORIENTATION_PORTRAIT -> {
    //     testCurrentOrientation = Configuration.ORIENTATION_PORTRAIT
    //   }
    //   Configuration.ORIENTATION_LANDSCAPE -> {
    //     testCurrentOrientation = Configuration.ORIENTATION_LANDSCAPE
    //   }
    // }
    // Log.d("LOG", "AppLock.canUpdate oCC " + canUpdate)
    // if (canUpdate) {canUpdate = false;updateUI(null)} // BLOCK 1st FLAG ASAP
    //rootView.requestApplyInsets()
    //decorView.requestApplyInsets()
    contentViewRef.requestApplyInsets()
    //ViewCompat.requestApplyInsets(rootView)
    //if (canUpdate) {canUpdate = false;updateUI(null)} // BLOCK 1st FLAG ASAP
  }

  override fun getMainComponentName(): String = "reactNativeCalculator"

  override fun createReactActivityDelegate(): ReactActivityDelegate =
    DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
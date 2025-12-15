cd /c/Users/pablo/AppData/Local/Android/Sdk/platform-tools/ && # GO TO ADB FOLDER
#./adb logcat -v raw *:S ReactNative:V ReactNativeJS:V AndroidRuntime:E # no-date: rn + android
./adb logcat -v raw *:S ReactNative:V ReactNativeJS:V # no-date: rn
#./adb logcat *:S ReactNative:V ReactNativeJS:V # date: rn
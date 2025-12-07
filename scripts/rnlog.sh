cd /c/Users/pablo/AppData/Local/Android/Sdk/platform-tools/ && # GO TO ADB FOLDER
./adb logcat -v raw *:S ReactNative:V ReactNativeJS:V # logs with no-newline
#./adb logcat *:S ReactNative:V ReactNativeJS:V # logs with newline
#cd /c/Users/pablo/AppData/Local/Android/Sdk/platform-tools/ && # GO TO ADB FOLDER
#./adb logcat --clear # CLEAR PREVIOUS LOGCAT
cd /c/Users/pablo/AppData/Local/Android/Sdk/platform-tools/ && # GO TO ADB FOLDER
./adb -s emulator-5554 logcat | grep "D LOG" # START LISTEN emulator-5554 DEBUG LOG WITH "LOG" TAG
#./adb logcat -c && #
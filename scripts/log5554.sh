cd /c/Users/pablo/AppData/Local/Android/Sdk/platform-tools/ && # GO TO ADB FOLDER
#./adb -s emulator-5554 logcat | grep "D LOG" # date: emulator-5554 DEBUG "LOG" TAG
#./adb -s emulator-5554 logcat -v brief LOG:D *:S # no-date: (D/LOG + PID) emulator-5554 DEBUG "LOG" TAG
./adb logcat -v raw *:S LOG:D # no-date: (CLEAN) emulator-5554 DEBUG "LOG" TAG
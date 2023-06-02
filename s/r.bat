REM https://firebase.google.com/docs/analytics/debugview
adb shell setprop debug.firebase.analytics.app co.koli.android
:adb -s "emulator-5554" uninstall co.koli.android.staging/.MainActivity & npm run android --deviceId=emulator-5554
:adb shell setprop debug.firebase.analytics.app .none.
:npx react-native run-android
..\r
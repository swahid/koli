## Upgrading Pod

sudo gem install cocoapods

## Keystore file 'C:\Users\User\koli-app2\android\app\debug.keystore' not found for signing config 'debug'.

Just download the file from official template:
https://raw.githubusercontent.com/facebook/react-native/master/template/android/app/debug.keystore

and move it to the directory android\app.


Cannot fit requested classes in a single dex file (# fields: 66957 > 65536)

in build.gradle set multiDexEnabled true in default config  to avoid this error

## Error: EMFILE: too many open files, watch

brew update

brew install watchman

## "cannot find symbol import android.support.v4.app.NotificationCompat" error

e.g.

C:\Users\<username>>\koli-app2\node_modules\react-native-firebase-push-notifications\android\src\main\java\com\afrihost\firebase\notifications\DisplayNotificationTask.java:15: error: cannot find symbol
import android.support.v4.app.NotificationCompat;

Automated linking is not working for firebase push notifications for some reason.

Make sure you run the react native link for the push notifications library (react-native-firebase-push-notifications).

For both Android and iOS, link it manually -

npx react-native link react-native-firebase-push-notifications

If you have installed react-native globally, run it without the npx command.

For iOS only -

cd ios && pod install && cd ..

https://www.npmjs.com/package/react-native-firebase-push-notifications

Creating builds

Android
With command line - 
Step 1 - react-native bundle --dev false --platform android --entry-file index.js --bundle-output ./android/app/src/main/assets/index.android.bundle --assets-dest ./android/app/src/main/res
Step 2 - cd android
Step 3 - 
    For creating staging build use the commage - ./gradlew assembleStaging
    For creating staging build use the commage - ./gradlew assembleRelease
    
From Android Stuido - 
Step 1 - react-native bundle --dev false --platform android --entry-file index.js --bundle-output ./android/app/src/main/assets/index.android.bundle --assets-dest ./android/app/src/main/res
Step 2 - Build -> Generate Signed Bundle/APK -> APK -> choose staging/release -> Finish

iOS
Using XCode
Step 1: Select Target -> Koli/KoliQA
Step 2: Product > Destination > Generic iOS Device
Step 3: Product -> Archive

## Multiple Environment Configuration
Staging and Production envionment is used in the app. For using environment following steps should be verified

**iOS**
* Click on `koli` in the left corner of the top bar > `Manage Schemes` and scroll down to find the scheme `koli` and `KOLI QA`. Then click on Edit in the bottom left corner.
* Click on `Build accordion` (without expanding it), then on the + in the bottom left corner. Search for “React” and add the item named React (dah). Make sure to untick `Parallelize build`.
* Expand `Build` accordion, click on `Pre-actions` then for the `koli` script content should be `echo ".env.production" > /tmp/envfile` 
and for `KOLI QA` it should be `echo ".env.staging" > /tmp/envfile`

Commands for running iOS app on device.

**Staging**:
`npx react-native run-ios --scheme "KOLI QA"`

**Production**:
`npx react-native run-ios --scheme "koli"`

**Android**

* Open `android/app/build.gradle`
* Check `buildTypes` contains `release` and `staging` 

Commands for running iOS app on device.

**Staging**:
`npx react-native run-android --variant="staging"`

**Production**:
`npx react-native run-android --variant="release"`

[Multiple Environments Reference](https://medium.com/swlh/setting-up-multiple-environments-on-react-native-for-ios-and-android-c43f3128754fhttp:// "Multiple Environments Reference")

Commands for removing duplicate assets android.

rm -rf ./android/app/src/main/res/drawable-*

rm -rf ./android/app/src/main/res/raw

##References

Read more [here](./OTHERS.md).


REM temporary workaround due to crashing related to the non-supported RN 0.66 c.f. https://github.com/FaridSafi/react-native-gifted-chat/issues/2109
:copy node_modules\react-native-gifted-chat\lib\MessageContainer.js MessageContainer.js
copy MessageContainer.js node_modules\react-native-gifted-chat\lib\MessageContainer.js

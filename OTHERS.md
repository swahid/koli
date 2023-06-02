#Build

###Staging build

s/bdebug or s\bdebug
###Production build

s/b or s\b

#Increment A Build Number for CICD

iOS -

Edit the following value in ios/koli/Info.plist
	<key>CFBundleShortVersionString</key>
	<string>XXX</string>
...
    <key>CFBundleVersion</key>
    <string>YYY</string>
e.g.
	<key>CFBundleShortVersionString</key>
	<string>2.17</string>
...
    <key>CFBundleVersion</key>
    <string>178</string>

Android -

Edit the following value in android/app/build.gradle
    defaultConfig {
...
        versionCode 179
        versionName "2.17"

#Known Issue

. If you are not able to build due the certificate issue, make sure you have ask KOLI admin to remove an invalid accounts on https://developer.apple.com/account/resources/certificates/list.

. Jest error "Consider adding an error boundary to your tree to customize error handling behavior."

Check the line error related to the app starting from the top to the bottom.

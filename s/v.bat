:REM in order to use a common scripts, need to have pixel3a (R Google API) and pixel3a XL (R Google API) AVD installed
:beesight avd

apksigner verify --verbose --print-certs android\app\build\outputs\apk\release\release-2.17.apk
:java -jar apksigner.jar verify --verbose android\app\build\outputs\apk\release\release-2.17.apk

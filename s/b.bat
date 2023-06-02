set APP_VERSION=2.19.3
echo %APP_VERSION%
pause "Hit any key if the version is correct"

:rmdir /s/q node_modules & npm i
node -v && del /q android\app\build\outputs\apk\release\*.* & npx jetify && npm run build:android && cd android && gradlew clean & gradlew assembleRelease -x bundleReleaseJsAndAssets && cd .. && dir android\app\build\outputs\apk\release\*apk && call s\z.bat && s\up && dir android\app\build\outputs\apk\release\*apk && start android\app\build\outputs\apk\release

:node -v && del /q android\app\build\outputs\apk\release\*.* & rmdir /s/q node_modules & npm i && cd android && gradlew assembleRelease -x bundleReleaseJsAndAssets && cd .. && dir android\app\build\outputs\apk\release\*apk && call s\z.bat && s\up && dir android\app\build\outputs\apk\release\*apk && start android\app\build\outputs\apk\release

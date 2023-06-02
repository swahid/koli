:move App\Stores\rootStore.js App\Stores\RootStore.js
:npm i -D jetifier && npx jetify

rmdir /s/q android\app\src\main\res\drawable-mdpi
rmdir /s/q android\app\src\main\res\drawable-xhdpi
rmdir /s/q android\app\src\main\res\drawable-xxhdpi
rmdir /s/q android\app\src\main\res\drawable-xxxhdpi
rmdir /s/q android\app\src\main\res\drawable-hdpi

rmdir /s/q android\app\src\main\res\raw

REM temporary workaround due to crashing related to the non-supported RN 0.66 c.f. https://github.com/FaridSafi/react-native-gifted-chat/issues/2109
:copy node_modules\react-native-gifted-chat\lib\MessageContainer.js MessageContainer.js
copy MessageContainer.js node_modules\react-native-gifted-chat\lib\MessageContainer.js

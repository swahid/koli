:keep chmod settings
git config --global core.fileMode false

:REM change this to your name
git config user.email "koliapp2019@gmail.com"
git config user.name "KOLI DEV"

:REM change this to your ANDROID directory
set ANDROID_HOME=%USERPROFILE%\AppData\Local\Android\Sdk
:REM change this to your JDK directory
set JAVA_HOME=C:\Program Files\ojdkbuild\java-1.8.0-openjdk-1.8.0.252-1
set SONARQUBE_HOME=%homepath%\Downloads\sonar-scanner-4.3.0.2102-windows
set PATH=%PATH%;%USERPROFILE%\AppData\Local\Android\Sdk\emulator;%ANDROID_HOME%\platform-tools;%SONARQUBE_HOME%\bin

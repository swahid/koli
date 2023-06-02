git config user.email "koliapp2019@gmail.com"
git config user.name "KOLI DEV"
set app=koliapp2
set MYSQL_HOME=C:\mysql-5.6.44-winx64
:set MYSQL_HOME=C:\mysql-5.7.26-winx64
:set JAVA_HOME=C:\Java\jdk-11.0.3
set JAVA_HOME=C:\AmazonCorretto\jdk1.8.0_312\jdk1.8.0_312
set CATALINA_HOME=C:\apache-tomcat-9.0.20-windows-x64
:set SONARQUBE_HOME=%homepath%\sonar-scanner-4.3.0.2102-windows
set ANDROID_HOME=%userprofile%\AppData\Local\Android\Sdk
set RUBY_HOME=C:\tools\ruby30
set PATH=%RUBY_HOME%\bin;%MYSQL_HOME%\bin;%JAVA_HOME%\bin;%ANDROID_HOME%\tools;%ANDROID_HOME%\build-tools\31.0.0;%PATH%
set SONAR_TOKEN=26e058558a311246d9e6a0f89629d3d7c8e8a95b
:nodist use 10
:nvm use 16.11.1
REM https://itsmycode.com/error-digital-envelope-routines-unsupported/
nvm use 16.14.0

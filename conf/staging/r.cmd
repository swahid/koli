set OPENSSL_HOME=C:\OpenSSL-Win64
set PATH=%OPENSSL_HOME%\bin;%PATH%

keytool -exportcert -alias key -keystore key.jks -storepass K0l1K0l1!!! -keypass K0l1K0l1!!! | openssl sha1 -binary | openssl base64

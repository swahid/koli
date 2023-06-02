:call s\setenv
pause "Run in Administrator console right?"

del %homepath%\sonar-scanner-4.3.0.2102-windows\bin\..\conf\sonar-scanner.properties
del C:\ProgramData\chocolatey\lib\sonarqube-scanner.portable\tools\sonar-scanner-4.6.2.2472-windows\conf\sonar-scanner.properties

sonar-scanner -D"sonar.projectKey=2.0_koli-app" -D"sonar.organization=2-0" -D"sonar.host.url=https://sonarcloud.io" -D"sonar.sources=." -D"sonar.c.file.suffixes=-" -D"sonar.cpp.file.suffixes=-" -D"sonar.objc.file.suffixes=-"

REM This script will add all the changes you have done locally blindly and push it to remote git - use it cautiously!
call s\setenv

:cp -f server/modules/serverless-real.js server/modules/serverless.js
copy /Y server\modules\serverless-real.js server\modules\serverless.js

git add -A && s\cm %1&&s\pp&&s\np

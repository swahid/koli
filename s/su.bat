echo "Open a powershell and execute Set-ExecutionPolicy RemoteSigned at least once and try this command again"

powershell -ExecutionPolicy ByPass -Command "Start-Process PowerShell -ArgumentList '-NoExit -Command cd %cd%' -Verb RunAs"

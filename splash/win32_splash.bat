REM start %~dp0\\..\\..\\win32\\node-webkit\\nw.exe %~dp0
set NW_EXE=..\\win32\\node-webkit\\nw.exe
set CHROMEDRV=..\\win32\\node-webkit\\chromedriver.exe
set CHROMEDRV_UP1=..\\..\\win32\\node-webkit\\chromedriver.exe

if exist %NW_EXE% (
	if exist %CHROMEDRV% (
		copy "%~dp0\\package.new" "%~dp0\\package.json" /Y
	) else (
		copy "%~dp0\\package.orig" "%~dp0\\package.json" /Y
	)
    start %NW_EXE% --remote-debugging-port=9222 splash
) else (
	if exist %CHROMEDRV_UP1% (
		copy "%~dp0\\package.new" "%~dp0\\package.json" /Y
	) else (
		copy "%~dp0\\package.orig" "%~dp0\\package.json" /Y
	)
    start ..\\%NW_EXE% --remote-debugging-port=9222 splash
)

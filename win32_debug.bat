@echo off
echo Starting GUI Composer...
cd /d %~dp0
REM set TI_DS_ENABLE_LOGGING=1
REM set TI_DS_LOGGING_OUTPUT=%~dp0..\\cloudAgentLog.log
set SPLASH_DIR=%~dp0splash_debug
set CHROMEDRV=..\\win32\\node-webkit\\chromedriver.exe
set CHROMEDRV_UP1=..\\..\\win32\\node-webkit\\chromedriver.exe
if exist %CHROMEDRV% (
	echo Please hit F12 when in GUI Composer to open the debugger. Use win32_start.bat to avoid this message.
	pause
	call "win32_start.bat"
) else (
	if exist %CHROMEDRV_UP1% (
		echo Please hit F12 when in GUI Composer to open the debugger.  Use win32_start.bat to avoid this message.
		pause
		call "win32_start.bat"
	) else (
		if exist %SPLASH_DIR% (
			call "splash_debug\win32_splash.bat"
		) else (
			call "splash\win32_debug.bat"
		)
   )
)

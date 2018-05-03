copy "%~dp0\\package.debug" "%~dp0\\package.json" /Y
set NW_EXE=..\\win32\\node-webkit\\nw.exe
if exist %NW_EXE% (
    start %NW_EXE% splash 
) else (
    start ..\\%NW_EXE% splash 
)
@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"

where pwsh >nul 2>nul
if errorlevel 1 (
  set "PS=powershell"
) else (
  set "PS=pwsh"
)

%PS% -NoProfile -ExecutionPolicy Bypass -File "%~dp0publish.ps1" %*
set "CODE=%ERRORLEVEL%"

echo.
if not "%CODE%"=="0" (
  echo Failed - see the error above. exit code: %CODE%
)
if /I not "%PUBLISH_NO_PAUSE%"=="1" pause
exit /b %CODE%

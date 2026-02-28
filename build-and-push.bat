@echo off
setlocal EnableDelayedExpansion

if "%~1"=="-h" goto :usage
if "%~1"=="--help" goto :usage

if "%DOCKER_USERNAME%"=="" set "DOCKER_USERNAME=vutheviet"
if "%IMAGE_NAME%"=="" set "IMAGE_NAME=ladifinal"
if "%SMOKE_PORT%"=="" set "SMOKE_PORT=5001"

if "%~1"=="" (
  for /f %%i in ('powershell -NoProfile -Command "$t=''; try { $t = (git describe --tags --exact-match 2^>^$null) } catch {}; if ([string]::IsNullOrWhiteSpace($t)) { Get-Date -Format yyyyMMdd-HHmmss } else { $t }"') do set "TAG=%%i"
) else (
  set "TAG=%~1"
)

set "FULL_IMAGE=%DOCKER_USERNAME%/%IMAGE_NAME%:%TAG%"
set "LATEST_IMAGE=%DOCKER_USERNAME%/%IMAGE_NAME%:latest"
set "SMOKE_CONTAINER=%IMAGE_NAME%-smoke-test"

echo [INFO] Building image: %FULL_IMAGE%

docker info >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Docker daemon is not running.
  exit /b 1
)

docker build --pull -t "%FULL_IMAGE%" -t "%LATEST_IMAGE%" .
if errorlevel 1 (
  echo [ERROR] Docker build failed.
  exit /b 1
)

docker rm -f "%SMOKE_CONTAINER%" >nul 2>&1

for /f %%p in ('powershell -NoProfile -Command "$p=%SMOKE_PORT%; while($p -le 65535){ try { $l=[System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback,$p); $l.Start(); $l.Stop(); Write-Output $p; break } catch { $p++ } }"') do set "SELECTED_PORT=%%p"

if "%SELECTED_PORT%"=="" (
  echo [ERROR] Could not find a free smoke-test port.
  exit /b 1
)

if not "%SELECTED_PORT%"=="%SMOKE_PORT%" (
  echo [WARN] Port %SMOKE_PORT% busy, using %SELECTED_PORT%
)

echo [INFO] Running smoke test container on port %SELECTED_PORT%
docker run -d --name "%SMOKE_CONTAINER%" -p %SELECTED_PORT%:5000 "%FULL_IMAGE%" >nul
if errorlevel 1 (
  echo [ERROR] Failed to start smoke test container.
  exit /b 1
)

set "HEALTH_OK="
for /L %%i in (1,1,45) do (
  powershell -NoProfile -Command "try { $r = Invoke-WebRequest -UseBasicParsing http://127.0.0.1:%SELECTED_PORT%/health -TimeoutSec 2; if ($r.StatusCode -eq 200) { exit 0 } else { exit 1 } } catch { exit 1 }"
  if !errorlevel! EQU 0 (
    set "HEALTH_OK=1"
    goto :health_done
  )
  timeout /t 1 >nul
)

:health_done
if not defined HEALTH_OK (
  echo [ERROR] Smoke test failed. Container logs:
  docker logs "%SMOKE_CONTAINER%"
  docker rm -f "%SMOKE_CONTAINER%" >nul 2>&1
  exit /b 1
)

docker rm -f "%SMOKE_CONTAINER%" >nul 2>&1

docker info 2>nul | findstr /R /C:"^ Username:" >nul
if errorlevel 1 (
  echo [INFO] Docker Hub login required.
  docker login
  if errorlevel 1 (
    echo [ERROR] Docker login failed.
    exit /b 1
  )
)

echo [INFO] Pushing image tags...
docker push "%FULL_IMAGE%"
if errorlevel 1 (
  echo [ERROR] Failed to push %FULL_IMAGE%
  exit /b 1
)

docker push "%LATEST_IMAGE%"
if errorlevel 1 (
  echo [ERROR] Failed to push %LATEST_IMAGE%
  exit /b 1
)

echo.
echo Build and push completed
echo Image tag: %FULL_IMAGE%
echo Image tag: %LATEST_IMAGE%
exit /b 0

:usage
echo Build, smoke-test on Docker Desktop, then push to Docker Hub.
echo.
echo Usage:
echo   build-and-push.bat [tag]
exit /b 0

@echo off
REM Build and push Docker image to Docker Hub (Windows version)

REM Configuration
set DOCKER_USERNAME=vutheviet
set IMAGE_NAME=ladifinal
if "%1"=="" (
    for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
    set TAG=!dt:~0,8!-!dt:~8,6!
) else (
    set TAG=%1
)
set FULL_IMAGE=%DOCKER_USERNAME%/%IMAGE_NAME%:%TAG%
set LATEST_IMAGE=%DOCKER_USERNAME%/%IMAGE_NAME%:latest

echo 🚀 Building and pushing Docker image...
echo 📦 Image: %FULL_IMAGE%

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not running. Please start Docker and try again.
    exit /b 1
)

REM Build the image
echo 🔨 Building Docker image...
docker build --no-cache -t "%FULL_IMAGE%" -t "%LATEST_IMAGE%" .
if %errorlevel% neq 0 (
    echo ❌ Failed to build image
    exit /b 1
)

REM Login to Docker Hub
echo 🔐 Logging in to Docker Hub...
docker login
if %errorlevel% neq 0 (
    echo ❌ Failed to login to Docker Hub
    exit /b 1
)

REM Push the images
echo 📤 Pushing images to Docker Hub...
docker push "%FULL_IMAGE%"
docker push "%LATEST_IMAGE%"
if %errorlevel% neq 0 (
    echo ❌ Failed to push images
    exit /b 1
)

echo ✅ Successfully pushed:
echo    - %FULL_IMAGE%
echo    - %LATEST_IMAGE%
echo.
echo 📋 To deploy on server, run:
echo    export DOCKER_IMAGE=%FULL_IMAGE%
echo    docker-compose -f docker-compose.prod.yml pull
echo    docker-compose -f docker-compose.prod.yml up -d
@echo off
setlocal
cd /d "%~dp0"

if not exist ".env" (
	echo Missing .env. Copy .env.example to .env and configure the required values first.
	exit /b 1
)

if not exist "node_modules\vite\bin\vite.js" (
	echo Dependencies are not installed. Run npm ci first.
	exit /b 1
)

call npm.cmd run dev:all

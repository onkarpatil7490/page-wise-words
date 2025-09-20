@echo off
REM ---------------------------------------
REM Batch script for page-wise-words repo
REM ---------------------------------------

REM Go to the root folder of the repo (folder containing this script)
cd /d "%~dp0"

REM Ask user for Gemini API key
set /p GOOGLE_API_KEY=Enter your Gemini API key: 

REM Create/update .env file
echo GOOGLE_API_KEY="%GOOGLE_API_KEY%" > .env
echo .env file created/updated with your API key.

REM Activate Python virtual environment
call page_wise_env\Scripts\activate.bat

REM Run FastAPI server in a new terminal window
start "" cmd /k "uvicorn main:app --reload --port 9000"

REM Wait a few seconds then open the browser
timeout /t 5 /nobreak >nul
start "" http://127.0.0.1:9000/

REM Give server a few seconds to start
timeout /t 5 /nobreak >nul

REM Run frontend (npm dev server) in a new terminal window
start "" cmd /k "npm run dev"

REM Wait a few seconds then open the browser
timeout /t 5 /nobreak >nul
start "" http://localhost:8080/

echo All services started. Press any key to exit this script.
pause >nul

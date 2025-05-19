@echo off
echo ========================================
echo    Running AI Hakeem Test Suite
echo ========================================

REM Step 1: Run backend tests
echo.
echo *** Running Backend Tests ***
echo.
cd backend
call npm test

REM Save backend test result
set BACKEND_RESULT=%ERRORLEVEL%

REM Step 2: Run frontend tests
echo.
echo *** Running Frontend Tests ***
echo.
cd ../frontend
call npm test

REM Save frontend test result
set FRONTEND_RESULT=%ERRORLEVEL%

REM Step 3: Display test summary
echo.
echo ========================================
echo             Test Summary
echo ========================================
if %BACKEND_RESULT% EQU 0 (
    echo Backend Tests: PASSED
) else (
    echo Backend Tests: FAILED
)

if %FRONTEND_RESULT% EQU 0 (
    echo Frontend Tests: PASSED
) else (
    echo Frontend Tests: FAILED
)
echo ========================================

REM Exit with error if any test suite failed
if %BACKEND_RESULT% NEQ 0 exit /B 1
if %FRONTEND_RESULT% NEQ 0 exit /B 1

exit /B 0 
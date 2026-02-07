@echo off
echo Starting MERN Stack Application...

start cmd /k "cd backend && npm run dev"
echo Backend server started on port 5000...

start cmd /k "cd frontend && npm run dev"
echo Frontend server started on port 5173...

echo.
echo Application is starting up!
echo Frontend: http://localhost:5173
echo Backend: http://localhost:5000
echo.
pause

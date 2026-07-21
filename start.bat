@echo off
echo Starting Desi Ghee website...
echo Open http://localhost:8080 in your browser
echo Press Ctrl+C to stop.
echo.
cd /d "%~dp0"
start http://localhost:8080
python -m http.server 8080

@echo off
echo ==========================================================
echo   SAD SCHOOL OF ECONOMICS - EDITORIAL SCRAPBOOK LAUNCHER
echo ==========================================================
echo.
echo [1/3] Applying Database Migrations...
python manage.py migrate
echo.
echo [2/3] Checking Translation Files...
if exist compile_po.py (
    python compile_po.py
) else (
    echo No compile_po.py found, skipping translation compilation.
)
echo.
echo [3/3] Launching Cinematic Y2K Scrapbook Platform...
echo.
echo ----------------------------------------------------------
echo   CINEMATIC SITE: http://127.0.0.1:8000/
echo   STUDENT ADMIN MODERATION: http://127.0.0.1:8000/admin/
echo ----------------------------------------------------------
echo.
python manage.py runserver
pause

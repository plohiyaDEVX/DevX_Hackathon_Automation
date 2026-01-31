@echo off
echo 🚀 Opening Beautiful Test Reports...
echo.
echo Opening Enhanced Report with Charts...
start "" "cypress\reports\beautiful-report.html"
echo.
echo Opening Standard Mochawesome Report...
start "" "cypress\reports\report.html"
echo.
echo Opening Cucumber HTML Report...
start "" "cypress\reports\cucumber-html-report.html"
echo.
echo ✅ All reports opened in your default browser!
pause
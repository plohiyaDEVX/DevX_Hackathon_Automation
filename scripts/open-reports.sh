#!/bin/bash

echo "🚀 Starting Beautiful Test Reports Dashboard..."
echo ""
echo "📊 Available Reports:"
echo "1. Mochawesome Report: cypress/reports/report.html"
echo "2. Cucumber HTML Report: cypress/reports/cucumber-html-report.html"  
echo "3. Reports Dashboard: reports-dashboard.html"
echo ""

# Open the main dashboard
if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
    # Windows
    start reports-dashboard.html
elif [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    open reports-dashboard.html
else
    # Linux
    xdg-open reports-dashboard.html
fi

echo "✅ Reports dashboard opened in your browser!"
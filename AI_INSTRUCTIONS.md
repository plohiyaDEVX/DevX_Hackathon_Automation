# 🤖 AI Instructions for Cypress BDD Dashboard Testing Framework

This document provides comprehensive instructions for AI assistants to help developers work with the Cypress BDD (Behavior Driven Development) testing framework for Dashboard page automation.

## 📁 Project Structure Overview

```
cypress/
├── e2e/dashboard/           # Feature files (.feature)
├── support/
│   ├── pageObjects/dashboard/   # Page Object Model classes
│   ├── stepDefinitions/dashboard/  # BDD step mappings
│   ├── commands.js              # Custom Cypress commands
│   └── e2e.js                  # Global support configuration
├── fixtures/                   # Test data files (.json)
└── screenshots/                # Test screenshots
```

## 🚀 Getting Started

### 1. Installation and Setup

```bash
# Install dependencies
npm install

# Install Cypress if not already installed
npm install cypress --save-dev

# Install BDD preprocessor
npm install @badeball/cypress-cucumber-preprocessor --save-dev

# Open Cypress Test Runner
npm run cy:open

# Run tests headlessly
npm test
```

### 2. Running Dashboard Tests

```bash
# Run all dashboard tests
npm run test:dashboard

# Run specific scenarios by tags
npx cypress run --env tags="@smoke"
npx cypress run --env tags="@critical"
npx cypress run --env tags="@widgets"

# Run in different browsers
npm run test:chrome
npm run test:firefox
npm run test:edge

# Run in headed mode (see browser)
npm run test:headed
```

## 📝 Adding New Dashboard Scenarios

### Step 1: Add Feature Scenarios

Edit `cypress/e2e/dashboard/dashboard.feature`:

```gherkin
@new-feature @dashboard
Scenario: User can filter dashboard by custom criteria
  Given the dashboard page is fully loaded
  When I apply a custom filter with criteria "sales > 1000"
  Then I should see filtered results
  And the filter should be saved in user preferences
```

### Step 2: Add Step Definitions

Add to `cypress/support/stepDefinitions/dashboard/dashboardSteps.js`:

```javascript
When('I apply a custom filter with criteria {string}', (criteria) => {
  cy.get('[data-testid="custom-filter"]').type(criteria);
  cy.get('[data-testid="apply-filter"]').click();
});

Then('I should see filtered results', () => {
  cy.get('[data-testid="filter-results"]').should('be.visible');
  cy.get('[data-testid="widget-container"]').should('have.length.greaterThan', 0);
});

And('the filter should be saved in user preferences', () => {
  cy.getDashboardPreferences().then((prefs) => {
    expect(prefs.customFilter).to.exist;
  });
});
```

### Step 3: Update Page Object Model (if needed)

Add new methods to `cypress/support/pageObjects/dashboard/DashboardPage.js`:

```javascript
// Add new selectors
this.customFilterInput = '[data-testid="custom-filter"]';
this.applyFilterButton = '[data-testid="apply-filter"]';

// Add new methods
applyCustomFilter(criteria) {
  cy.get(this.customFilterInput).clear().type(criteria);
  cy.get(this.applyFilterButton).click();
  return this;
}

verifyFilterResults() {
  cy.get('[data-testid="filter-results"]').should('be.visible');
  return this;
}
```

## 🎯 Best Practices for BDD + POM

### Writing Good Feature Files

**✅ DO:**
- Use business language, not technical terms
- Keep scenarios focused on user behavior
- Use descriptive Given/When/Then statements
- Add meaningful tags for organization
- Include both positive and negative scenarios

**❌ DON'T:**
- Include implementation details in features
- Make scenarios too long or complex
- Use technical CSS selectors in steps
- Write scenarios that test multiple features

**Example:**
```gherkin
# Good ✅
Scenario: User views quarterly sales performance
  Given I am on the dashboard page
  When I select "Q1 2024" from the date filter
  Then I should see sales data for January through March
  And the chart should display quarterly trends

# Bad ❌
Scenario: Click on date picker and verify DOM elements
  Given I click on '[data-testid="date-picker"]'
  When the calendar widget appears
  Then verify '.calendar-month' contains 'January'
```

### Page Object Model Guidelines

**✅ DO:**
- Use multiple selectors as fallbacks
- Create reusable methods for common actions
- Return `this` from methods for method chaining
- Group related selectors logically
- Add meaningful comments

**❌ DON'T:**
- Put assertions in Page Object methods
- Make methods too specific to one test
- Hard-code test data in Page Object
- Use only CSS selectors without data-testid

**Example:**
```javascript
// Good ✅
selectDateRange(startDate, endDate) {
  cy.get(this.dateRangeFilter).click();
  if (startDate) cy.get(this.startDateInput).clear().type(startDate);
  if (endDate) cy.get(this.endDateInput).clear().type(endDate);
  cy.get(this.applyButton).click();
  return this;
}

// Bad ❌
selectSpecificDate() {
  cy.get('[data-testid="date-picker"]').click();
  cy.get('[data-testid="start-date"]').type('2024-01-01');
  cy.get('[data-testid="end-date"]').type('2024-01-31');
  cy.get('[data-testid="apply"]').click();
  cy.get('[data-testid="widgets"]').should('be.visible'); // Assertion in POM ❌
}
```

### Step Definition Best Practices

**✅ DO:**
- Keep step definitions reusable
- Use Page Object methods
- Add proper error handling
- Use descriptive variable names
- Include helpful log messages

**❌ DON'T:**
- Put business logic in step definitions
- Use direct DOM manipulation
- Make steps too specific
- Ignore error handling

## 📊 Working with Test Data

### Using Fixtures

```javascript
// Load test data in step definitions
import dashboardData from '../../fixtures/dashboardData.json';

// Use in tests
Given('I have test data for {string}', (dataType) => {
  cy.fixture('dashboardData').then((data) => {
    const testData = data.testData[dataType];
    // Use testData in your test
  });
});
```

### Dynamic Test Data

```javascript
// Generate dynamic data
const generateTestData = () => ({
  dateRange: {
    start: new Date().toISOString().split('T')[0],
    end: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0]
  }
});

// Use in step definitions
When('I apply a recent date range', () => {
  const data = generateTestData();
  dashboardPage.selectDateRange(data.dateRange.start, data.dateRange.end);
});
```

## 🔧 Extending the Framework

### Adding New Page Objects

1. Create new page object file:
```javascript
// cypress/support/pageObjects/dashboard/NewWidgetPage.js
class NewWidgetPage {
  constructor() {
    this.widgetContainer = '[data-testid="new-widget"]';
    this.configButton = '[data-testid="config-btn"]';
  }
  
  configure(options) {
    cy.get(this.configButton).click();
    // Implementation
    return this;
  }
}

export default NewWidgetPage;
```

2. Import and use in step definitions:
```javascript
import NewWidgetPage from '../../pageObjects/dashboard/NewWidgetPage.js';
const newWidgetPage = new NewWidgetPage();
```

### Adding Custom Commands

Add reusable commands to `cypress/support/commands.js`:

```javascript
Cypress.Commands.add('verifyDashboardMetrics', (expectedMetrics) => {
  Object.keys(expectedMetrics).forEach(metricName => {
    cy.get(`[data-testid="${metricName}"]`)
      .should('contain.text', expectedMetrics[metricName]);
  });
});

// Usage in step definitions
cy.verifyDashboardMetrics({
  totalRevenue: '$2,450,000',
  activeUsers: '8,742'
});
```

## 🔍 Debugging and Troubleshooting

### Common Issues and Solutions

**Issue: Step definitions not found**
```bash
Error: Step implementation missing for: I should see dashboard widgets
```
**Solution:** Ensure step definition exists and is properly imported in `e2e.js`

**Issue: Element not found**
```bash
Error: Timed out retrying after 4000ms: Expected to find element
```
**Solution:** 
- Check if element exists with correct selector
- Add wait conditions
- Use multiple selector fallbacks in Page Object

**Issue: Test data not loading**
```bash
Error: Cannot read property 'testData' of undefined
```
**Solution:** Verify fixture file path and JSON structure

### Debug Commands

```javascript
// Add debug information
cy.debugDashboard(); // Custom command for dashboard info

// Take screenshots for debugging
cy.takeScreenshot('dashboard-state');

// Log element information
cy.get('[data-testid="widget"]').then($el => {
  console.log('Widget count:', $el.length);
});

// Pause test execution
cy.pause(); // Only works in interactive mode
```

### Performance Optimization

```javascript
// Measure performance
beforeEach(() => {
  cy.measurePageLoadTime();
});

// Optimize API calls
cy.intercept('GET', '**/api/dashboard/**').as('dashboardAPI');
cy.waitForAPIResponse('dashboardAPI');

// Reduce timeouts for faster failure detection
cy.get('[data-testid="widget"]', { timeout: 5000 });
```

## 🔄 CI/CD Integration

### GitHub Actions Example

```yaml
name: Dashboard E2E Tests
on: [push, pull_request]

jobs:
  cypress-run:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: cypress-io/github-action@v5
        with:
          start: npm start
          wait-on: 'http://localhost:5173'
          spec: 'cypress/e2e/dashboard/**/*.feature'
          browser: chrome
        env:
          CYPRESS_BASE_URL: http://localhost:5173
```

### Jenkins Pipeline

```groovy
pipeline {
  agent any
  stages {
    stage('Install') {
      steps {
        sh 'npm ci'
      }
    }
    stage('Start Application') {
      steps {
        sh 'npm start &'
        sh 'sleep 30' // Wait for app to start
      }
    }
    stage('Run Dashboard Tests') {
      steps {
        sh 'npm run test:dashboard'
      }
    }
  }
  post {
    always {
      publishHTML([
        allowMissing: false,
        alwaysLinkToLastBuild: false,
        keepAll: true,
        reportDir: 'cypress/reports',
        reportFiles: 'cucumber-html-report.html',
        reportName: 'Dashboard Test Report'
      ])
    }
  }
}
```

## 📈 Advanced Features

### API Mocking for Consistent Tests

```javascript
// Mock API responses
beforeEach(() => {
  cy.mockDashboardAPI('success'); // or 'error', 'slow'
});

// Custom API responses
cy.intercept('GET', '**/api/dashboard/widgets', {
  fixture: 'customWidgetData.json'
}).as('widgetAPI');
```

### Cross-Browser Testing

```javascript
// Configure multiple browsers in cypress.config.js
module.exports = defineConfig({
  e2e: {
    // ... other config
    browsers: ['chrome', 'firefox', 'edge']
  }
});

// Run tests across browsers
npm run test:chrome
npm run test:firefox
npm run test:edge
```

### Responsive Testing

```javascript
// Test different viewports
beforeEach(() => {
  cy.testResponsive('mobile'); // or 'tablet', 'desktop'
});

// Verify mobile layout
Then('the dashboard should be mobile-friendly', () => {
  cy.verifyMobileLayout();
});
```

## 🎨 Reporting and Documentation

### Generate HTML Reports

```bash
# Generate Cucumber HTML report
npm test
# Report available at: cypress/reports/cucumber-html-report.html
```

### Custom Reporting

```javascript
// Add to cypress.config.js
const { addCucumberPreprocessorPlugin } = require('@badeball/cypress-cucumber-preprocessor');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      addCucumberPreprocessorPlugin(on, config);
      
      // Custom reporting
      on('after:spec', (spec, results) => {
        // Custom logic for test results
      });
    }
  }
});
```

## 🚨 Error Handling Strategies

### Graceful Failure Handling

```javascript
// Handle expected errors
Given('the API is unavailable', () => {
  cy.mockDashboardAPI('error');
});

Then('I should see a user-friendly error message', () => {
  cy.get('[data-testid="error-message"]')
    .should('be.visible')
    .and('not.contain', 'undefined')
    .and('not.contain', '500 Internal Server Error');
});

// Retry logic
Cypress.Commands.add('retryableAction', (action, maxRetries = 3) => {
  let attempts = 0;
  const performAction = () => {
    attempts++;
    try {
      action();
    } catch (error) {
      if (attempts < maxRetries) {
        cy.wait(1000);
        performAction();
      } else {
        throw error;
      }
    }
  };
  performAction();
});
```

## 📚 Additional Resources

### Useful Cypress Plugins
- `cypress-real-events` - Real mouse and keyboard events
- `cypress-axe` - Accessibility testing
- `cypress-file-upload` - File upload testing
- `cypress-wait-until` - Custom wait conditions

### Documentation Links
- [Cypress Documentation](https://docs.cypress.io/)
- [Cucumber.js Guide](https://cucumber.io/docs/cucumber/)
- [Page Object Model Pattern](https://www.selenium.dev/documentation/test_practices/encouraged/page_object_models/)

### Community Resources
- [Cypress Discord](https://discord.gg/cypress)
- [Stack Overflow - Cypress](https://stackoverflow.com/questions/tagged/cypress)
- [GitHub Issues](https://github.com/cypress-io/cypress/issues)

---

## 🎯 Quick Reference Commands

```bash
# Essential commands for daily use
npm run cy:open              # Open test runner
npm run test:dashboard       # Run dashboard tests
npm run test:headed         # Run with browser visible
npx cypress run --spec "cypress/e2e/dashboard/dashboard.feature"

# Debugging
npx cypress open --e2e      # Interactive debugging
npx cypress run --headed --no-exit  # Keep browser open after tests
```

Remember: This framework is designed to be maintainable, scalable, and hackathon-ready. Focus on writing clear, descriptive tests that express business value while maintaining technical excellence! 🚀
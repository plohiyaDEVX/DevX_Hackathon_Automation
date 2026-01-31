// Import commands.js using ES2015 syntax:
import './commands'
import 'cypress-mochawesome-reporter/register'

// Note: Step definitions are automatically loaded from stepDefinitions folder
// No need to import them here as they are handled by the cucumber preprocessor

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Hide fetch/XHR requests from command log for cleaner output
const app = window.top;
if (!app.document.head.querySelector('[data-hide-command-log-request]')) {
  const style = app.document.createElement('style');
  style.innerHTML = '.command-name-request, .command-name-xhr { display: none }';
  style.setAttribute('data-hide-command-log-request', '');
  app.document.head.appendChild(style);
}

// Global error handling
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from failing the test on uncaught exceptions
  // You can customize this based on your application's error handling needs
  if (err.message.includes('Script error') || err.message.includes('Non-Error promise rejection')) {
    return false;
  }
  return true;
});

// Custom configuration for BDD
beforeEach(() => {
  // Clear local storage and cookies before each test
  cy.clearLocalStorage();
  cy.clearCookies();
});

// Add support for responsive testing
Cypress.Commands.add('setResolution', (size) => {
  if (Cypress._.isArray(size)) {
    cy.viewport(size[0], size[1]);
  } else {
    cy.viewport(size);
  }
});
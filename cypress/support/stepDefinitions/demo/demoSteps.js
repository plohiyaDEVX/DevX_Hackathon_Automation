import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

// Demo step definitions to show defect ticket creation
Given('I am on the login page', () => {
  cy.visit('/login');
});

When('I look for an element that doesn\'t exist', () => {
  // This will intentionally fail to demonstrate defect ticket creation
  cy.get('[data-testid="non-existent-element"]', { timeout: 2000 })
    .should('be.visible');
});

Then('I should trigger automatic defect ticket creation', () => {
  // This step won't be reached due to the failure above
  cy.log('This should trigger defect ticket creation');
});

When('I verify the page loads correctly', () => {
  cy.get('body').should('be.visible');
});

Then('login form should be visible', () => {
  cy.get('form, [data-testid="login-form"], input[type="email"], input[type="password"]')
    .should('exist');
});
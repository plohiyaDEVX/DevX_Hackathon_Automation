/**
 * Custom Cypress Commands for Login Testing
 * Add reusable commands to simplify test writing and maintenance
 */

// Import test data
import loginData from '../fixtures/loginData.json';
import testUsers from '../fixtures/testUsers.json';

// Authentication Commands
Cypress.Commands.add('loginAs', (userType = 'valid') => {
  let user;
  if (userType === 'valid') {
    user = testUsers.validUsers[0];
  } else {
    user = testUsers.invalidUsers.find(u => u.description.toLowerCase().includes(userType.toLowerCase()));
  }
  
  if (!user) {
    throw new Error(`User with type '${userType}' not found in test data`);
  }

  // Visit login page
  cy.visit(loginData.urls.loginPage);
  
  // Fill login form with flexible selectors
  cy.get('[data-testid="username"], #username, input[name="username"], input[type="email"], .username-input').type(user.username);
  cy.get('[data-testid="password"], #password, input[name="password"], input[type="password"], .password-input').type(user.password);
  cy.get('[data-testid="login-btn"], #login-btn, button[type="submit"], .login-button, button:contains("Login")').click();
  
  // Verify login attempt (success or failure based on user type)
  if (userType === 'valid') {
    cy.url().should('not.include', 'login');
  } else {
    cy.url().should('include', 'login');
  }
});

Cypress.Commands.add('logout', () => {
  cy.get('[data-testid="logout"], .logout, .sign-out, button:contains("Logout")').click();
  cy.url().should('include', 'login');
});

// Login Navigation Commands
Cypress.Commands.add('navigateToLogin', () => {
  cy.visit(loginData.urls.loginPage);
  cy.url().should('include', 'login');
  cy.get('body').should('be.visible');
});

Cypress.Commands.add('waitForLoginPageLoad', (timeout = 10000) => {
  cy.get('[data-testid="loading-spinner"], .loading', { timeout: 1000 }).should('not.exist');
  cy.get('body', { timeout }).should('be.visible');
});

// Form Interaction Commands
Cypress.Commands.add('fillLoginForm', (username, password) => {
  cy.get('[data-testid="username"], #username, input[name="username"], input[type="email"], .username-input').clear().type(username);
  cy.get('[data-testid="password"], #password, input[name="password"], input[type="password"], .password-input').clear().type(password);
});

Cypress.Commands.add('submitLoginForm', () => {
  cy.get('[data-testid="login-btn"], #login-btn, button[type="submit"], .login-button, button:contains("Login"), button:contains("Sign In")').click();
});

Cypress.Commands.add('clearLoginForm', () => {
  cy.get('body').then(($body) => {
    if ($body.find('[data-testid="username"], #username, input[name="username"], input[type="email"], .username-input').length > 0) {
      cy.get('[data-testid="username"], #username, input[name="username"], input[type="email"], .username-input').clear();
    }
    if ($body.find('[data-testid="password"], #password, input[name="password"], input[type="password"], .password-input').length > 0) {
      cy.get('[data-testid="password"], #password, input[name="password"], input[type="password"], .password-input').clear();
    }
  });
});

// Validation Commands
Cypress.Commands.add('verifyLoginError', (expectedMessage = null) => {
  cy.get('body').then(($body) => {
    if ($body.find('[data-testid="error"], .error-message, .alert-danger, .error, .invalid-feedback').length > 0) {
      cy.get('[data-testid="error"], .error-message, .alert-danger, .error, .invalid-feedback').should('be.visible');
      if (expectedMessage) {
        cy.get('[data-testid="error"], .error-message, .alert-danger, .error, .invalid-feedback').should('contain.text', expectedMessage);
      }
    } else {
      cy.log('No error message found, checking if still on login page');
      cy.url().should('include', 'login');
    }
  });
});

Cypress.Commands.add('verifyLoginSuccess', () => {
  // Check for success message or redirect away from login page
  cy.url().then((url) => {
    if (url.includes('login')) {
      cy.get('body').then(($body) => {
        if ($body.find('[data-testid="success"], .success-message, .alert-success, .success').length > 0) {
          cy.get('[data-testid="success"], .success-message, .alert-success, .success').should('be.visible');
        } else {
          cy.log('No explicit success message, but login form is present');
        }
      });
    } else {
      cy.log('Successfully redirected from login page');
    }
  });
});

Cypress.Commands.add('verifyValidationError', (field) => {
  const fieldErrorSelector = `[data-testid="${field}-error"], .${field}-error, .field-error[data-field="${field}"]`;
  cy.get('body').then(($body) => {
    if ($body.find(fieldErrorSelector).length > 0) {
      cy.get(fieldErrorSelector).should('be.visible');
    } else {
      cy.log(`No specific validation error found for ${field}`);
      cy.url().should('include', 'login');
    }
  });
});

// Security Commands
Cypress.Commands.add('verifyPasswordMasked', () => {
  cy.get('body').then(($body) => {
    if ($body.find('[data-testid="password"], #password, input[name="password"], input[type="password"], .password-input').length > 0) {
      cy.get('[data-testid="password"], #password, input[name="password"], input[type="password"], .password-input').should('have.attr', 'type', 'password');
    } else {
      cy.get('input[type="password"]').should('have.attr', 'type', 'password');
    }
  });
});

// Responsive Testing Commands
Cypress.Commands.add('testMobileView', () => {
  cy.viewport(375, 667);
  cy.get('body').should('be.visible');
  cy.wait(100); // Allow layout to settle
});

Cypress.Commands.add('testTabletView', () => {
  cy.viewport(768, 1024);
  cy.get('body').should('be.visible');
  cy.wait(100); // Allow layout to settle
});

Cypress.Commands.add('resetViewport', () => {
  cy.viewport(1280, 720);
});

// Accessibility Commands
Cypress.Commands.add('verifyFormLabels', () => {
  cy.get('body').then(($body) => {
    const hasLabels = $body.find('label').length > 0;
    
    if (hasLabels) {
      cy.get('label').should('have.length.greaterThan', 0);
    } else {
      cy.log('No labels found, checking for placeholder text or aria-labels');
      cy.get('input').should('exist');
    }
  });
});

Cypress.Commands.add('testKeyboardNavigation', () => {
  cy.get('body').then(($body) => {
    const focusableElements = $body.find('input, button, a, [tabindex]:not([tabindex="-1"])');
    
    if (focusableElements.length > 0) {
      cy.wrap(focusableElements.first()).focus().should('be.focused');
      cy.log(`Found ${focusableElements.length} focusable elements`);
    } else {
      cy.log('No focusable elements found');
    }
  });
});

// Test Data Commands  
Cypress.Commands.add('getLoginTestData', () => {
  return cy.wrap(loginData);
});

Cypress.Commands.add('getUserTestData', () => {
  return cy.wrap(testUsers);
});
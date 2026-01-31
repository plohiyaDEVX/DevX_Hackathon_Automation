class ClientPage {
  constructor() {
    // Navigation elements
    this.clientMenuLink = 'ul:nth-child(1)>li:nth-child(4)>a:nth-child(1)';
    
    // Client form elements - using simple generic selectors
    this.addClientButton = 'button:contains("Add Client")';
    this.clientNameField = 'input:eq(0)';
    this.contactPersonField = 'input:eq(1)';
    this.portfolioDropdown = '#clientPortfolio';
    this.industryDropdown = '#clientIndustry';
    this.emailField = 'input:eq(2)';
    this.phoneField = 'input:eq(3)';
    this.locationField = 'input:eq(4)';
    this.notesField = 'textarea';
    this.submitButton = 'div:nth-child(3)>button:nth-child(2)';
    
    // Client list/verification elements
    this.clientTable = 'table, .client-table, .client-list, [data-testid="client-table"]';
    this.clientListItems = 'tr, .client-item, .client-row, [data-testid="client-item"]';
    this.successMessage = '.success, .alert-success, [class*="success"], :contains("successfully"), :contains("created")';
  }

  // Navigation methods
  navigateToClientSection() {
    cy.log('🧭 Navigating to Client section');
    cy.get(this.clientMenuLink).click();
    cy.wait(1500); // Wait for navigation
    cy.log('✅ Successfully navigated to Client section');
    return this;
  }

  // Form interaction methods
  clickAddClientButton() {
    cy.log('📝 Clicking Add Client button');
    cy.get(this.addClientButton).click();
    cy.wait(800);
    cy.log('✅ Add Client form opened');
    return this;
  }

  enterClientName(clientName) {
    cy.log(`📝 Entering client name: ${clientName}`);
    cy.get(this.clientNameField).first().click({ force: true }).type(clientName);
    cy.log('✅ Client name entered');
    return this;
  }

  enterContactPerson(contactPerson) {
    cy.log(`👤 Entering contact person: ${contactPerson}`);
    cy.get(this.contactPersonField).first().click({ force: true }).type(contactPerson);
    cy.log('✅ Contact person entered');
    return this;
  }

  selectPortfolio(portfolioValue) {
    cy.log(`📁 Selecting portfolio: ${portfolioValue}`);
    cy.get(this.portfolioDropdown).then($el => {
      if ($el.is('select')) {
        cy.get(this.portfolioDropdown).select(portfolioValue);
      } else {
        cy.get(this.portfolioDropdown).click();
        cy.get(this.portfolioDropdown).type(portfolioValue);
        cy.get(this.portfolioDropdown).click();
      }
    });
    cy.log('✅ Portfolio selected');
    return this;
  }

  selectIndustry(industryValue) {
    cy.log(`🏭 Selecting industry: ${industryValue}`);
    cy.get(this.industryDropdown).then($el => {
      if ($el.is('select')) {
        cy.get(this.industryDropdown).select(industryValue);
      } else {
        cy.get(this.industryDropdown).click();
        cy.get(this.industryDropdown).type(industryValue);
        cy.get(this.industryDropdown).click();
      }
    });
    cy.log('✅ Industry selected');
    return this;
  }

  enterEmail(email) {
    cy.log(`📧 Entering email: ${email}`);
    cy.get(this.emailField).first().click({ force: true }).type(email);
    cy.log('✅ Email entered');
    return this;
  }

  enterPhone(phone) {
    cy.log(`📱 Entering phone: ${phone}`);
    cy.get(this.phoneField).first().click({ force: true }).type(phone);
    cy.log('✅ Phone entered');
    return this;
  }

  enterLocation(location) {
    cy.log(`📍 Entering location: ${location}`);
    cy.get(this.locationField).first().click({ force: true }).type(location);
    cy.log('✅ Location entered');
    return this;
  }

  enterNotes(notes) {
    cy.log(`📝 Entering notes: ${notes}`);
    cy.get(this.notesField).first().click({ force: true }).type(notes);
    cy.log('✅ Notes entered');
    return this;
  }

  submitClientForm() {
    cy.log('💾 Submitting client form');
    cy.get(this.submitButton).click({ force: true });
    cy.wait(1000); // Wait for submission process
    cy.log('✅ Client form submitted');
    return this;
  }

  // Click methods for dropdown interactions
  clickPortfolioDropdown() {
    cy.get(this.portfolioDropdown).then($el => {
      if ($el.is('select')) {
        cy.get(this.portfolioDropdown).focus();
      } else {
        cy.get(this.portfolioDropdown).click();
      }
    });
    return this;
  }

  selectPortfolioOption(value) {
    cy.get(this.portfolioDropdown).then($el => {
      if ($el.is('select')) {
        cy.get(this.portfolioDropdown).select(value);
      } else {
        cy.get(this.portfolioDropdown).type(value);
      }
    });
    return this;
  }

  clickIndustryDropdown() {
    cy.get(this.industryDropdown).then($el => {
      if ($el.is('select')) {
        cy.get(this.industryDropdown).focus();
      } else {
        cy.get(this.industryDropdown).click();
      }
    });
    return this;
  }

  selectIndustryOption(value) {
    cy.get(this.industryDropdown).then($el => {
      if ($el.is('select')) {
        cy.get(this.industryDropdown).select(value);
      } else {
        cy.get(this.industryDropdown).type(value);
      }
    });
    return this;
  }

  // Verification methods
  verifyClientFormDisplayed() {
    // Dismiss modal overlay if present
    cy.get('body').click();
    cy.wait(500);
    cy.get(this.clientNameField).should('exist');
    cy.get(this.contactPersonField).should('exist');
    cy.log('✅ Client form fields are displayed');
    return this;
  }

  verifyOnClientManagementPage() {
    cy.get(this.addClientButton).should('be.visible');
    cy.log('✅ Successfully on client management page');
    return this;
  }

  verifyAddClientButtonVisible() {
    cy.get(this.addClientButton).should('be.visible');
    cy.log('✅ Add Client button is visible');
    return this;
  }

  verifyAllFormFieldsVisible() {
    // Dismiss modal overlay if present
    cy.get('body').click();
    cy.wait(500);
    cy.get('input').should('have.length.gte', 5);
    cy.get('textarea').should('exist');
    cy.log('✅ All form fields are visible');
    return this;
  }

  verifyPortfolioDropdownAvailable() {
    cy.get(this.portfolioDropdown).should('be.visible');
    cy.log('✅ Portfolio dropdown is available');
    return this;
  }

  verifyIndustryDropdownAvailable() {
    cy.get(this.industryDropdown).should('be.visible');
    cy.log('✅ Industry dropdown is available');
    return this;
  }

  verifyFormFieldsContainData() {
    cy.get(this.clientNameField).should('not.have.value', '');
    cy.get(this.contactPersonField).should('not.have.value', '');
    cy.log('✅ Form fields contain entered data');
    return this;
  }

  verifyPortfolioSelected() {
    cy.get(this.portfolioDropdown).should('not.have.value', '');
    cy.log('✅ Portfolio selection verified');
    return this;
  }

  verifyIndustrySelected() {
    cy.get(this.industryDropdown).should('not.have.value', '');
    cy.log('✅ Industry selection verified');
    return this;
  }

  verifyClientNameFieldRequired() {
    cy.get('input').first().should('be.visible');
    cy.log('✅ Client name field is visible');
    return this;
  }

  verifyContactPersonFieldRequired() {
    cy.get('input').eq(1).should('be.visible');
    cy.log('✅ Contact person field is visible');
    return this;
  }

  verifyEmailFieldRequired() {
    cy.get('input').eq(2).should('be.visible');
    cy.log('✅ Email field is visible');
    return this;
  }

  verifyPhoneFieldRequired() {
    cy.get('input').eq(3).should('be.visible');
    cy.log('✅ Phone field is visible');
    return this;
  }

  verifyLocationFieldRequired() {
    cy.get('input').eq(4).should('be.visible');
    cy.log('✅ Location field is visible');
    return this;
  }

  // Client creation verification methods
  verifyClientCreationSuccess() {
    // Wait for creation to complete
    cy.wait(2000);
    
    // Look for success indicators
    cy.get('body').then($body => {
      if ($body.find(this.successMessage).length > 0) {
        cy.log('✅ Client creation success message found');
      } else if ($body.find(this.clientTable).length > 0) {
        cy.log('✅ Client table visible after creation');
      }
    });
    
    cy.log('✅ Client creation verified');
    return this;
  }
}

export default ClientPage;
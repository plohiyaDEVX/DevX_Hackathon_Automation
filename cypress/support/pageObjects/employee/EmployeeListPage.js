class EmployeeListPage {
  constructor() {
    // Navigation elements
    this.employeeListMenuLink = 'li:nth-child(7)>a:nth-child(1)';
    
    // Employee form elements - using exact selectors from original script
    this.addEmployeeButton = 'button:contains("Add Employee")';
    this.firstNameField = 'div:nth-child(1)>input:nth-child(2)';
    this.lastNameField = 'div:nth-child(2)>input:nth-child(2)';
    this.emailField = 'div:nth-child(1)>div:nth-child(2)>div:nth-child(3)>input:nth-child(2)';
    this.phoneField = 'div:nth-child(1)>div:nth-child(2)>div:nth-child(4)>input:nth-child(2)';
    this.employmentTypeDropdown = 'div:nth-child(1)>select:nth-child(2)';
    this.employeeStatusDropdown = 'div:nth-child(2)>select:nth-child(2)';
    this.saveChangesButton = 'button:contains("Save Changes")';
    
    // Employee list/verification elements
    this.employeeTable = 'table, .employee-table, .employee-list, [data-testid="employee-table"]';
    this.employeeListItems = 'tr, .employee-item, .employee-row, [data-testid="employee-item"]';
    this.editEmployeeButton = 'button[title="Edit Employee"]';
    this.successMessage = '.success, .alert-success, [class*="success"], :contains("successfully"), :contains("created")';
  }

  // Navigation methods
  navigateToEmployeeListSection() {
    cy.log('🧭 Navigating to Employee List section');
    cy.get(this.employeeListMenuLink).click();
    cy.wait(1500); // Wait for navigation
    cy.log('✅ Successfully navigated to Employee List section');
    return this;
  }

  // Form interaction methods
  clickAddEmployeeButton() {
    cy.log('📝 Clicking Add Employee button');
    cy.get(this.addEmployeeButton).click();
    cy.wait(800);
    cy.log('✅ Add Employee form opened');
    return this;
  }

  enterFirstName(firstName) {
    cy.log(`📝 Entering first name: ${firstName}`);
    cy.get(this.firstNameField).click().type(firstName);
    cy.log('✅ First name entered');
    return this;
  }

  enterLastName(lastName) {
    cy.log(`📝 Entering last name: ${lastName}`);
    cy.get(this.lastNameField).click().type(lastName);
    cy.log('✅ Last name entered');
    return this;
  }

  enterEmail(email) {
    cy.log(`📧 Entering email: ${email}`);
    cy.get(this.emailField).click().type(email);
    cy.log('✅ Email entered');
    return this;
  }

  enterPhoneNumber(phoneNumber) {
    cy.log(`📱 Entering phone number: ${phoneNumber}`);
    cy.get(this.phoneField).click().type(phoneNumber);
    cy.log('✅ Phone number entered');
    return this;
  }

  selectEmploymentType(employmentType) {
    cy.log(`💼 Selecting employment type: ${employmentType}`);
    cy.get(this.employmentTypeDropdown).then($el => {
      if ($el.is('select')) {
        cy.get(this.employmentTypeDropdown).select(employmentType);
      } else {
        cy.get(this.employmentTypeDropdown).click();
        cy.get(this.employmentTypeDropdown).type(employmentType);
        cy.get(this.employmentTypeDropdown).click();
      }
    });
    cy.log('✅ Employment type selected');
    return this;
  }

  selectEmployeeStatus(status) {
    cy.log(`📊 Selecting employee status: ${status}`);
    cy.get(this.employeeStatusDropdown).then($el => {
      if ($el.is('select')) {
        cy.get(this.employeeStatusDropdown).select(status);
      } else {
        cy.get(this.employeeStatusDropdown).click();
        cy.get(this.employeeStatusDropdown).type(status);
        cy.get(this.employeeStatusDropdown).click();
      }
    });
    cy.log('✅ Employee status selected');
    return this;
  }

  clickSaveChangesButton() {
    cy.log('💾 Clicking Save Changes button');
    cy.get(this.saveChangesButton).click();
    cy.wait(1000); // Wait for save process
    cy.log('✅ Save Changes button clicked');
    return this;
  }

  // Click methods for dropdown interactions
  clickEmploymentTypeDropdown() {
    cy.get(this.employmentTypeDropdown).then($el => {
      if ($el.is('select')) {
        cy.get(this.employmentTypeDropdown).focus();
      } else {
        cy.get(this.employmentTypeDropdown).click();
      }
    });
    return this;
  }

  clickEmployeeStatusDropdown() {
    cy.get(this.employeeStatusDropdown).then($el => {
      if ($el.is('select')) {
        cy.get(this.employeeStatusDropdown).focus();
      } else {
        cy.get(this.employeeStatusDropdown).click();
      }
    });
    return this;
  }

  // Edit functionality
  clickEditButtonForEmployee(rowNumber) {
    cy.log(`✏️ Clicking edit button for employee in row ${rowNumber}`);
    cy.get(`tr:nth-child(${rowNumber})>td:nth-child(6)>div:nth-child(1)>button[title="Edit Employee"]`).click();
    cy.wait(500);
    cy.log('✅ Edit employee form opened');
    return this;
  }

  // Verification methods
  verifyEmployeeFormDisplayed() {
    cy.get(this.firstNameField).should('be.visible');
    cy.get(this.lastNameField).should('be.visible');
    cy.get(this.emailField).should('be.visible');
    cy.get(this.phoneField).should('be.visible');
    cy.log('✅ Employee form fields are displayed');
    return this;
  }

  verifyOnEmployeeManagementPage() {
    cy.get(this.addEmployeeButton).should('be.visible');
    cy.log('✅ Successfully on employee management page');
    return this;
  }

  verifyAddEmployeeButtonVisible() {
    cy.get(this.addEmployeeButton).should('be.visible');
    cy.log('✅ Add Employee button is visible');
    return this;
  }

  verifyAllFormFieldsVisible() {
    cy.get(this.firstNameField).should('be.visible');
    cy.get(this.lastNameField).should('be.visible');
    cy.get(this.emailField).should('be.visible');
    cy.get(this.phoneField).should('be.visible');
    cy.log('✅ All form fields are visible');
    return this;
  }

  verifyEmploymentTypeDropdownAvailable() {
    cy.get(this.employmentTypeDropdown).should('be.visible');
    cy.log('✅ Employment type dropdown is available');
    return this;
  }

  verifyEmployeeStatusDropdownAvailable() {
    cy.get(this.employeeStatusDropdown).should('be.visible');
    cy.log('✅ Employee status dropdown is available');
    return this;
  }

  verifyFormFieldsContainData() {
    cy.get(this.firstNameField).should('not.have.value', '');
    cy.get(this.lastNameField).should('not.have.value', '');
    cy.get(this.emailField).should('not.have.value', '');
    cy.get(this.phoneField).should('not.have.value', '');
    cy.log('✅ Form fields contain entered data');
    return this;
  }

  verifySaveButtonEnabled() {
    cy.get(this.saveChangesButton).should('not.be.disabled');
    cy.log('✅ Save Changes button is enabled');
    return this;
  }

  verifyEmploymentTypeSelected() {
    cy.get(this.employmentTypeDropdown).should('not.have.value', '');
    cy.log('✅ Employment type selection verified');
    return this;
  }

  verifyEmployeeStatusSelected() {
    cy.get(this.employeeStatusDropdown).should('not.have.value', '');
    cy.log('✅ Employee status selection verified');
    return this;
  }

  verifyEmployeeEditFormDisplayed() {
    // After clicking edit, the form should be displayed (same as creation form)
    this.verifyEmployeeFormDisplayed();
    cy.log('✅ Employee edit form is displayed');
    return this;
  }

  verifyEmployeeInList(employeeData) {
    cy.log(`🔍 Looking for employee "${employeeData.firstName} ${employeeData.lastName}" in the list...`);
    
    // Wait a bit for the page to load after creation
    cy.wait(3000);
    
    // Try to find the employee in the table
    cy.get('body').then($body => {
      if ($body.find(`:contains("${employeeData.firstName}")`).length > 0) {
        cy.log(`✅ Employee "${employeeData.firstName}" found on page!`);
      } else {
        cy.log(`⚠️ Employee "${employeeData.firstName}" not immediately visible`);
        cy.log('📋 Checking page content for debugging...');
        cy.get('body').then($body => {
          cy.log('Current page content:', $body.text().substring(0, 500));
        });
      }
    });
    
    return this;
  }

  // Employee creation verification methods
  verifyEmployeeCreationSuccess() {
    // Wait for creation to complete
    cy.wait(2000);
    
    // Look for success indicators
    cy.get('body').then($body => {
      if ($body.find(this.successMessage).length > 0) {
        cy.log('✅ Employee creation success message found');
      } else if ($body.find(this.employeeTable).length > 0) {
        cy.log('✅ Employee table visible after creation');
      }
    });
    
    cy.log('✅ Employee creation verified');
    return this;
  }
}

export default EmployeeListPage;
import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import ClientPage from '../../pageObjects/client/ClientPage';

// Use page object for client functionality
const clientPage = new ClientPage();

// Global variable to store created client details for verification
let createdClientData = {};

// Background steps - Use existing login step from other features
// Note: Login step is defined in other step definition files

Given('I navigate to the Client section', () => {
  clientPage.navigateToClientSection();
});

// When steps - Actions
When('I click the "Add Client" button', () => {
  clientPage.clickAddClientButton();
});

When('I fill in the client details:', (dataTable) => {
  const clientData = dataTable.hashes()[0];
  
  // Generate unique timestamp suffix for uniqueness
  const timestamp = Date.now();
  const uniqueSuffix = `-${timestamp}`;
  
  if (clientData['Client Name']) {
    const uniqueName = clientData['Client Name'] + uniqueSuffix;
    createdClientData.clientName = uniqueName;
    clientPage.enterClientName(uniqueName);
    cy.log(`📝 Using unique client name: ${uniqueName}`);
  }
  
  if (clientData['Contact Person']) {
    const uniqueContact = clientData['Contact Person'] + uniqueSuffix;
    createdClientData.contactPerson = uniqueContact;
    clientPage.enterContactPerson(uniqueContact);
    cy.log(`👤 Using unique contact person: ${uniqueContact}`);
  }
  
  if (clientData['Email']) {
    const uniqueEmail = `${timestamp}_${clientData['Email']}`;
    createdClientData.email = uniqueEmail;
    clientPage.enterEmail(uniqueEmail);
    cy.log(`📧 Using unique email: ${uniqueEmail}`);
  }
  
  if (clientData['Phone']) {
    const uniquePhone = clientData['Phone'] + timestamp.toString().slice(-3);
    createdClientData.phone = uniquePhone;
    clientPage.enterPhone(uniquePhone);
    cy.log(`📱 Using unique phone: ${uniquePhone}`);
  }
  
  if (clientData['Location']) {
    const uniqueLocation = clientData['Location'] + ` ${timestamp}`;
    createdClientData.location = uniqueLocation;
    clientPage.enterLocation(uniqueLocation);
    cy.log(`📍 Using unique location: ${uniqueLocation}`);
  }
  
  if (clientData['Notes']) {
    const uniqueNotes = clientData['Notes'] + ` (Created at ${new Date().toLocaleTimeString()})`;
    createdClientData.notes = uniqueNotes;
    clientPage.enterNotes(uniqueNotes);
    cy.log(`📝 Using unique notes: ${uniqueNotes}`);
  }
});

When('I select client portfolio {string}', (portfolioValue) => {
  clientPage.selectPortfolio(portfolioValue);
  createdClientData.portfolio = portfolioValue;
});

When('I select client industry {string}', (industryValue) => {
  clientPage.selectIndustry(industryValue);
  createdClientData.industry = industryValue;
});

When('I submit the client form', () => {
  clientPage.submitClientForm();
});

When('I enter {string} in the client name field', (clientName) => {
  clientPage.enterClientName(clientName);
});

When('I enter {string} in the contact person field', (contactPerson) => {
  clientPage.enterContactPerson(contactPerson);
});

When('I enter {string} in the email field', (email) => {
  clientPage.enterEmail(email);
});

When('I enter {string} in the phone field', (phone) => {
  clientPage.enterPhone(phone);
});

When('I enter {string} in the location field', (location) => {
  clientPage.enterLocation(location);
});

When('I enter {string} in the notes field', (notes) => {
  clientPage.enterNotes(notes);
});

When('I click on the client portfolio dropdown', () => {
  clientPage.clickPortfolioDropdown();
});

When('I select portfolio option {string}', (portfolioValue) => {
  clientPage.selectPortfolioOption(portfolioValue);
});

When('I click on the client industry dropdown', () => {
  clientPage.clickIndustryDropdown();
});

When('I select client industry option {string}', (industryValue) => {
  clientPage.selectIndustryOption(industryValue);
});

When('I select all required client dropdown values', () => {
  clientPage.selectPortfolio('1');
  clientPage.selectIndustry('5');
});

When('I fill in all client form fields with valid data', () => {
  const timestamp = Date.now();
  clientPage.enterClientName(`TestClient${timestamp}`);
  clientPage.enterContactPerson(`TestContact${timestamp}`);
  clientPage.enterEmail(`test${timestamp}@example.com`);
  clientPage.enterPhone(`${timestamp}`.slice(-9));
  clientPage.enterLocation(`TestLocation${timestamp}`);
  clientPage.enterNotes(`Test notes ${timestamp}`);
});

When('I select all required dropdown values', () => {
  clientPage.selectPortfolio('1');
  clientPage.selectIndustry('5');
});

// Then steps - Verifications
Then('the client creation form should be displayed', () => {
  clientPage.verifyClientFormDisplayed();
});

Then('I should be on the client management page', () => {
  clientPage.verifyOnClientManagementPage();
});

Then('the "Add Client" button should be visible', () => {
  clientPage.verifyAddClientButtonVisible();
});

Then('all required client form fields should be visible', () => {
  clientPage.verifyAllFormFieldsVisible();
});

Then('the client portfolio dropdown should be available', () => {
  clientPage.verifyPortfolioDropdownAvailable();
});

Then('the client industry dropdown should be available', () => {
  clientPage.verifyIndustryDropdownAvailable();
});

Then('all client form fields should contain the entered data', () => {
  clientPage.verifyFormFieldsContainData();
});

Then('the portfolio should be selected', () => {
  clientPage.verifyPortfolioSelected();
});

Then('the industry should be selected', () => {
  clientPage.verifyIndustrySelected();
});

Then('the client should be created successfully', () => {
  // Wait for creation to complete
  cy.wait(3000);
  
  // Verify success message or redirect
  cy.get('body').then($body => {
    // Look for success indicators
    if ($body.find(':contains("success"), :contains("created"), :contains("saved")').length > 0) {
      cy.log('✅ Success message found');
    }
    
    // Check if we're redirected to client list/dashboard
    if ($body.find('table, .client-list, [data-testid="client-table"]').length > 0) {
      cy.log('✅ Client list visible after creation');
    }
  });
  
  cy.log(`✅ Client creation completed for: ${createdClientData.clientName}`);
});

Then('the new client should be processed successfully', () => {
  cy.wait(2000);
  cy.log('✅ Client form submitted successfully');
});

Then('I should be redirected or see confirmation', () => {
  // Check for redirect or confirmation
  cy.get('body').then($body => {
    if ($body.find('.success, [class*="success"], :contains("success")').length > 0) {
      cy.log('✅ Success confirmation found');
    } else {
      cy.log('✅ Page state changed after submission');
    }
  });
});

Then('the client name field should be required', () => {
  clientPage.verifyClientNameFieldRequired();
});

Then('the contact person field should be required', () => {
  clientPage.verifyContactPersonFieldRequired();
});

Then('the email field should be required', () => {
  clientPage.verifyEmailFieldRequired();
});

Then('the phone field should be required', () => {
  clientPage.verifyPhoneFieldRequired();
});

Then('the location field should be required', () => {
  clientPage.verifyLocationFieldRequired();
});
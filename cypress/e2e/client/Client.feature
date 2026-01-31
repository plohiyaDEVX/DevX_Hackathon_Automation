Feature: Client Management
  As a logged-in user
  I want to manage clients in the system
  So that I can add and maintain client records

  Background:
    Given I am logged in to the application
    And I navigate to the Client section

  @smoke @client
  Scenario: Successfully add a new client with valid data
    When I click the "Add Client" button
    Then the client creation form should be displayed
    When I fill in the client details:
      | field           | value           |
      | Client Name     | Omnigo          |
      | Contact Person  | John            |
      | Email           | Test@gmail.com  |
      | Phone           | 686867987       |
      | Location        | New Delhi       |
      | Notes           | QA              |
    And I select client portfolio "1"
    And I select client industry "5"
    And I submit the client form
    Then the client should be created successfully

  @client @navigation
  Scenario: User can access client management section
    When I navigate to the Client section
    Then I should be on the client management page
    And the "Add Client" button should be visible

  @client @form-display
  Scenario: Client creation form displays correctly
    When I click the "Add Client" button
    Then the client creation form should be displayed
    And all required client form fields should be visible
    And the client portfolio dropdown should be available
    And the client industry dropdown should be available

  @client @form-validation
  Scenario: Client form accepts valid input data
    When I click the "Add Client" button
    And I enter "Omnigo" in the client name field
    And I enter "John" in the contact person field
    And I enter "Test@gmail.com" in the email field
    And I enter "686867987" in the phone field
    And I enter "New Delhi" in the location field
    And I enter "QA" in the notes field
    Then all client form fields should contain the entered data

  @client @dropdown-functionality
  Scenario: Client dropdowns work correctly
    When I click the "Add Client" button
    And I click on the client portfolio dropdown
    And I select portfolio option "1"
    Then the portfolio should be selected
    When I click on the client industry dropdown
    And I select client industry option "5"
    Then the industry should be selected

  @client @form-workflow
  Scenario: Complete client creation workflow
    When I click the "Add Client" button
    And I fill in all client form fields with valid data
    And I select all required client dropdown values
    And I submit the client form
    Then the new client should be processed successfully
    And I should be redirected or see confirmation

  @client @required-fields
  Scenario: Client form validates required fields
    When I click the "Add Client" button
    Then the client name field should be required
    And the contact person field should be required
    And the email field should be required
    And the phone field should be required
    And the location field should be required
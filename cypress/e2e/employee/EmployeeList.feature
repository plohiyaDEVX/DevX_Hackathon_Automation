Feature: Employee List Management
  As a logged-in user
  I want to manage employees in the system
  So that I can add, edit and maintain employee records

  Background:
    Given I am logged in to the application
    And I navigate to the Employee List section

  @smoke @employee
  Scenario: Successfully add a new employee with valid data
    When I click the "Add Employee" button
    Then the employee creation form should be displayed
    When I fill in the employee details:
      | field           | value                |
      | First Name      | Miles                |
      | Last Name       | Ken                  |
      | Email           | Milesken@gmail.com   |
      | Phone Number    | 6474756              |
    And I select employment type "FTE"
    And I select employee status "Active"
    And I click the "Save Changes" button
    Then the employee should be created successfully

  @employee @edit
  Scenario: Successfully edit an existing employee
    Given there are employees in the system
    When I click the edit button for the 4th employee in the list
    Then the employee edit form should be displayed
    When I click the "Save Changes" button
    Then the employee changes should be saved successfully

  @employee @navigation
  Scenario: User can access employee list section
    When I navigate to the Employee List section
    Then I should be on the employee management page
    And the "Add Employee" button should be visible

  @employee @form-display
  Scenario: Employee creation form displays correctly
    When I click the "Add Employee" button
    Then the employee creation form should be displayed
    And all required employee form fields should be visible
    And the employment type dropdown should be available
    And the employee status dropdown should be available

  @employee @form-validation
  Scenario: Employee form accepts valid input data
    When I click the "Add Employee" button
    And I enter "Miles" in the first name field
    And I enter "Ken" in the last name field
    And I enter "Milesken@gmail.com" in the employee email field
    And I enter "6474756" in the phone number field
    Then all form fields should contain the entered data
    And the "Save Changes" button should be enabled

  @employee @dropdown-functionality
  Scenario: Employee dropdowns work correctly
    When I click the "Add Employee" button
    And I click on the employment type dropdown
    And I select employment type "FTE"
    Then the employment type should be selected
    When I click on the employee status dropdown
    And I select employee status "Active"
    Then the employee status should be selected

  @employee @form-workflow
  Scenario: Complete employee creation workflow
    When I click the "Add Employee" button
    And I fill in all employee form fields with valid data
    And I select all required employee dropdown values
    And I save the employee record
    Then the new employee should appear in the employee list
    And I should be able to edit the newly created employee
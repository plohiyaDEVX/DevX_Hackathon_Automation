Feature: Login Page Functionality
  As a user
  I want to login to the application
  So that I can access the system

  Background:
    Given I navigate to the login page

  @smoke
  Scenario: Successful login with valid credentials
    When I enter valid username "something@company.com"
    And I enter valid password "password@123"
    And I click the login button
    Then I should be logged in successfully
    And I should see a success message or be redirected

  @negative
  Scenario: Failed login with invalid username
    When I enter invalid username "invalid@email.com"
    And I enter valid password "password@123"
    And I click the login button
    Then I should see an error message
    And I should remain on the login page

  @negative
  Scenario: Failed login with invalid password
    When I enter valid username "something@company.com"
    And I enter invalid password "wrongpassword"
    And I click the login button
    Then I should see an error message
    And I should remain on the login page

  @negative
  Scenario: Failed login with empty fields
    When I leave username field empty
    And I leave password field empty
    And I click the login button
    Then I should see validation errors
    And I should remain on the login page

  @ui
  Scenario: Login page elements are visible
    Then I should see the username field
    And I should see the password field
    And I should see the login button
    And I should see the page title

  @responsive
  Scenario: Login page is responsive on mobile devices
    When I view the page on mobile device
    Then all login elements should be visible
    And the layout should be mobile-friendly

  @accessibility
  Scenario: Login page is accessible
    Then all form fields should have proper labels
    And the page should be navigable with keyboard
    And all interactive elements should be focusable

  @security
  Scenario: Password field masks input
    When I enter password "password@123"
    Then the password should be masked
    And the actual password should not be visible
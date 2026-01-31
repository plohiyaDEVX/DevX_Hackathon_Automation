@test @demo
Feature: Defect Ticket Demo
  As a developer
  I want to see automatic defect ticket creation
  When tests fail

  @critical @demo-failure
  Scenario: Intentional test failure for demo
    Given I am on the login page
    When I look for an element that doesn't exist
    Then I should trigger automatic defect ticket creation

  @medium @demo-success
  Scenario: This test should pass
    Given I am on the login page
    When I verify the page loads correctly
    Then login form should be visible
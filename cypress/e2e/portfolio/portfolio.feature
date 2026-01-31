Feature: Portfolio Management
  As a logged-in user
  I want to manage portfolios in the system
  So that I can create and organize my project portfolios

  Background:
    Given I am logged in to the application
    And I navigate to the Portfolio section

  @smoke @portfolio
  Scenario: Successfully create a new portfolio with valid data
    When I click the "New Portfolio" button
    Then the portfolio creation form should be displayed
    When I fill in the portfolio details:
      | field             | value                          |
      | Portfolio Name    | Civil Infrastructure 2026-001 |
      | Portfolio Code    | CIV-2026-001                   |
      | Portfolio Manager | Jack Wilson                    |
      | Description       | Civil infrastructure projects |
    And I select portfolio industry by typing "4"
    And I select portfolio region by typing "11"
    And I click the "Create Portfolio" button
    Then the portfolio should be created successfully
    And I can access the portfolio edit function
    And I can close any open modals

  @portfolio @dropdown
  Scenario: Verify dropdown selections work correctly
    When I click the "New Portfolio" button
    And I click on the portfolio industry dropdown
    And I type "4" in the industry field
    Then the industry should be selected
    When I click on the portfolio region dropdown
    And I type "11" in the region field
    Then the region should be selected

  @portfolio @navigation
  Scenario: User can access portfolio menu successfully
    When I navigate to the Portfolio section
    Then I should be on the portfolio page
    And the "New Portfolio" button should be visible

  @portfolio @menu-visibility
  Scenario: Portfolio menu is accessible and functional
    Given I can see the portfolio menu link
    When I click on the portfolio menu
    Then I should be redirected to the portfolio section
    And the portfolio management interface should be displayed

  @portfolio @form-display
  Scenario: New portfolio form displays correctly
    When I click the "New Portfolio" button
    Then the portfolio creation form should be displayed
    And all required form fields should be visible

  @portfolio @form-reset
  Scenario: Portfolio form can be properly reset
    When I click the "New Portfolio" button
    And I fill in the portfolio details:
      | field             | value                       |
      | Portfolio Name    | Test Portfolio Reset 2026   |
      | Portfolio Code    | TPR-2026-001                |
      | Portfolio Manager | Sarah Test Manager          |
      | Description       | Portfolio for reset testing |
    And I select portfolio industry "3"
    When I refresh the page
    Then the portfolio creation form should be empty

  @portfolio @button-state
  Scenario: Create portfolio button is accessible and functional
    When I click the "New Portfolio" button
    Then the create portfolio button should be visible
    When I fill in the portfolio details:
      | field             | value                        |
      | Portfolio Name    | State Validation Portfolio   |
      | Portfolio Code    | SVP-2026-001                 |
      | Portfolio Manager | Alex State Manager           |
      | Description       | Testing button state changes |
    Then the create portfolio button should be enabled
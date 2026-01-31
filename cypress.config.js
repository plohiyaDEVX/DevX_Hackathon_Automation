const { defineConfig } = require('cypress');
const { addCucumberPreprocessorPlugin } = require('@badeball/cypress-cucumber-preprocessor');
const createBundler = require('@bahmutov/cypress-esbuild-preprocessor');
const { createEsbuildPlugin } = require('@badeball/cypress-cucumber-preprocessor/esbuild');
const DefectReporter = require('./cypress/support/defectReporting');
const GitHubDefectReporter = require('./cypress/support/githubDefects');
const LocalTicketLogger = require('./cypress/support/localTicketLogger');

// Load environment variables
require('dotenv').config();

module.exports = defineConfig({
  e2e: {
    // Base URL for the application under test
    baseUrl: 'http://localhost:5173',
    
    // Viewport settings
    viewportWidth: 1280,
    viewportHeight: 720,
    
    // Test file patterns
    specPattern: 'cypress/e2e/**/*.feature',
    supportFile: 'cypress/support/e2e.js',
    
    // Reporting configuration
    reporter: 'cypress-mochawesome-reporter',
    reporterOptions: {
      charts: true,
      reportPageTitle: 'DevX Hackathon Automation',
      embeddedScreenshots: true,
      inlineAssets: true,
      saveAllAttempts: false,
      reportDir: 'cypress/reports',
      reportFilename: '[datetime]-beautiful-report',
      timestamp: 'isoDateTime',
      videoOnFailOnly: false,
      showPassed: true,
      showFailed: true,
      showPending: true,
      showSkipped: false,
      enableCode: true,
      enableCharts: true,
      autoOpen: false,
      overwrite: true,
      json: true,
      html: true
    },
    
    // Video and screenshot settings
    video: true,
    screenshotOnRunFailure: true,
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
    
    // Timeouts
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 30000,
    responseTimeout: 30000,
    
    // Retry settings
    retries: {
      runMode: 2,
      openMode: 0
    },
    
    // Test isolation
    testIsolation: true,
    
    // Browser settings
    chromeWebSecurity: false,
    
    // Environment variables
    env: {
      login_url: '/login',
      api_base_url: 'http://localhost:5173/api'
    },

    async setupNodeEvents(on, config) {
      // Setup mochawesome reporter first
      require('cypress-mochawesome-reporter/plugin')(on);
      
      // Add cucumber preprocessor plugin
      await addCucumberPreprocessorPlugin(on, config);

      // Setup esbuild bundler for typescript/module support
      on(
        'file:preprocessor',
        createBundler({
          plugins: [createEsbuildPlugin(config)],
        })
      );
      
      // Task for custom commands
      on('task', {
        log(message) {
          console.log(message);
          return null;
        },
        
        // 🎫 Defect Reporting Tasks
        async createJiraTicket(testFailure) {
          const reporter = new DefectReporter();
          return await reporter.createJiraTicket(testFailure);
        },
        
        async createGitHubIssue(testFailure) {
          const reporter = new GitHubDefectReporter();
          return await reporter.createIssue(testFailure);
        },
        
        async createSuccessTicket(testSuccess) {
          const reporter = new DefectReporter();
          return await reporter.createSuccessTicket(testSuccess);
        }
      });

      // Helper function to categorize tests for better reporting
      function categorizeTest(testTitle) {
        const title = testTitle.toLowerCase();
        if (title.includes('login') || title.includes('authentication')) return 'Authentication';
        if (title.includes('validation') || title.includes('error')) return 'Validation';
        if (title.includes('responsive') || title.includes('mobile')) return 'Responsive Design';
        if (title.includes('accessible') || title.includes('a11y')) return 'Accessibility';
        if (title.includes('password') || title.includes('security')) return 'Security';
        if (title.includes('performance') || title.includes('speed')) return 'Performance';
        return 'Functional';
      }

      // 🎨 Auto-generate dynamic beautiful report after test run
      on('after:run', (results) => {
        if (results) {
          console.log('🎨 Auto-generating beautiful report...');
          try {
            require('./scripts/generate-dynamic-beautiful-report.js');
            console.log('✅ Beautiful report generated successfully!');
          } catch (error) {
            console.log('⚠️ Failed to generate beautiful report:', error.message);
            // Fallback to static report
            try {
              require('./scripts/generate-beautiful-report.js');
              console.log('✅ Fallback static report generated!');
            } catch (fallbackError) {
              console.log('❌ Failed to generate any report:', fallbackError.message);
            }
          }
        }
      });

      // Return the updated config
      return config;
    }
  },
  
  // Component testing configuration (if needed in future)
  component: {
    devServer: {
      framework: 'create-react-app',
      bundler: 'webpack',
    },
  },
});
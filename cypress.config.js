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
      reportPageTitle: '🚀 Login Automation - Beautiful Test Report',
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
      
      // 🚨 Auto-create tickets on test failure
      on('after:spec', async (spec, results) => {
        if (results && results.stats.failures > 0) {
          console.log(`🚨 Test failures detected in ${spec.name}`);
          
          // Create defect tickets for failures
          for (const test of results.tests) {
            if (test.state === 'failed') {
              const testFailure = {
                testName: test.title.join(' - '),
                specFile: spec.relative,
                browser: results.browserName,
                environment: config.baseUrl,
                errorMessage: test.displayError,
                stackTrace: test.err?.stack || 'No stack trace available',
                tags: ['@login', '@automation'],
                scenario: test.title[0], // Feature name
                pageUrl: config.baseUrl,
                failedStep: test.title[test.title.length - 1],
                os: require('os').platform(),
                cypressVersion: require('cypress/package.json').version,
                nodeVersion: process.version,
                viewport: `${config.viewportWidth}x${config.viewportHeight}`,
                expected: 'Test should pass',
                actual: 'Test failed',
                testSteps: test.title || [],
                screenshots: [], // Will be populated with actual screenshot paths
                videoUrl: `cypress/videos/${spec.name.replace('.feature', '.mp4')}`
              };
              
              // Create tickets (choose your preferred system)
              if (process.env.ENABLE_JIRA_TICKETS === 'true') {
                try {
                  const defectReporter = new DefectReporter();
                  const jiraTicket = await defectReporter.createJiraTicket(testFailure);
                  console.log(`📋 Jira defect ticket created: ${jiraTicket}`);
                } catch (error) {
                  console.log('⚠️ Jira ticket creation failed:', error.message);
                  
                  // Fallback to local ticket creation
                  const localLogger = new LocalTicketLogger();
                  const localTicket = await localLogger.createDefectTicket(testFailure);
                  console.log(`💾 Created local defect ticket instead: ${localTicket}`);
                }
              } else {
                // Create local ticket if Jira is disabled
                const localLogger = new LocalTicketLogger();
                const localTicket = await localLogger.createDefectTicket(testFailure);
                console.log(`💾 Local defect ticket created: ${localTicket}`);
              }
              
              if (process.env.ENABLE_GITHUB_ISSUES === 'true') {
                try {
                  const githubReporter = new GitHubDefectReporter();
                  const githubIssue = await githubReporter.createIssue(testFailure);
                  console.log(`🐛 GitHub issue created: #${githubIssue}`);
                } catch (error) {
                  console.log('⚠️ GitHub issue creation failed:', error.message);
                }
              }
              
              // Always log failure for debugging
              console.log(`💥 Test Failed: ${testFailure.testName}`);
              console.log(`📝 Error: ${testFailure.errorMessage}`);
            }
          }
        } else if (results && results.stats.tests > 0 && results.stats.failures === 0) {
          // 🎉 All tests passed - create success ticket
          console.log(`🎉 All tests passed in ${spec.name}`);
          
          if (process.env.ENABLE_SUCCESS_TICKETS === 'true') {
            const passedScenarios = results.tests
              .filter(test => test.state === 'passed')
              .map(test => test.title[test.title.length - 1]);
            
            const testSuccess = {
              suiteName: spec.name.replace('.feature', '').replace(/^.*[\\\/]/, ''), // Get just filename
              specFile: spec.relative,
              browser: results.browserName,
              environment: config.baseUrl,
              totalTests: results.stats.tests,
              passedTests: results.stats.passes,
              duration: results.stats.wallClockDuration,
              passedScenarios: passedScenarios,
              testDetails: results.tests.map(test => ({
                title: test.title[test.title.length - 1],
                fullTitle: test.title.join(' - '),
                state: test.state,
                duration: test.duration,
                category: categorizeTest(test.title[test.title.length - 1])
              })),
              os: require('os').platform(),
              cypressVersion: require('cypress/package.json').version,
              nodeVersion: process.version,
              viewport: `${config.viewportWidth}x${config.viewportHeight}`,
              videoUrl: `cypress/videos/${spec.name.replace('.feature', '.mp4')}`,
              timestamp: new Date().toISOString()
            };
            
            try {
              const defectReporter = new DefectReporter();
              const successTicket = await defectReporter.createSuccessTicket(testSuccess);
              console.log(`🎊 Comprehensive success ticket created: ${successTicket}`);
              console.log(`✅ All ${testSuccess.totalTests} tests documented in Jira with full details!`);
              console.log(`📋 Ticket includes: Test scenarios, performance metrics, quality gates, and release readiness`);
            } catch (error) {
              console.log('⚠️ Success ticket creation failed:', error.message);
              
              // Fallback to local ticket creation
              const localLogger = new LocalTicketLogger();
              const localTicket = await localLogger.createSuccessTicket(testSuccess);
              console.log(`💾 Created local success ticket instead: ${localTicket}`);
              console.log(`✅ All ${testSuccess.totalTests} tests documented locally with full details!`);
            }
          }
        }
      });
      
      // Helper function to extract tags from test
      function extractTagsFromTest(test) {
        // Extract tags from test title or spec name
        const tags = [];
        const specContent = require('fs').readFileSync(spec.absolute, 'utf8');
        const tagMatches = specContent.match(/@\w+/g);
        return tagMatches || ['@login'];
      }
      
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
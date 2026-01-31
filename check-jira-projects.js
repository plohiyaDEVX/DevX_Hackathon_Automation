// Test script to check available Jira projects
const axios = require('axios');
require('dotenv').config();

async function checkJiraProjects() {
  try {
    console.log('🔍 Checking available Jira projects for user:', process.env.JIRA_USERNAME);
    
    const response = await axios.get(
      `${process.env.JIRA_HOST}/rest/api/2/project`,
      {
        auth: {
          username: process.env.JIRA_USERNAME,
          password: process.env.JIRA_API_TOKEN
        },
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
    console.log('\n📋 Available Projects:');
    response.data.forEach(project => {
      console.log(`✅ ${project.key} - ${project.name}`);
      console.log(`   URL: ${process.env.JIRA_HOST}/browse/${project.key}`);
    });
    
    console.log('\n💡 Try updating .env with one of these project keys:');
    console.log('JIRA_PROJECT=PROJECT_KEY_HERE');
    
  } catch (error) {
    console.error('❌ Error checking projects:', error.message);
    if (error.response) {
      console.error('Response:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

checkJiraProjects();
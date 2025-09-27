const fetch = require('node-fetch');

async function testAIPlayground() {
  console.log('🤖 Testing AI Playground with OpenAI Integration...\n');
  
  const baseUrl = 'http://localhost:3000';
  
  // Test data
  const testData = {
    description: 'A welcome email for new users that includes their name, a welcome message, account details, and a button to get started',
    workspaceName: 'Waymore',
    productName: 'Waymore Platform',
    userName: 'John'
  };
  
  try {
    // Test AI template generation
    console.log('📝 Testing AI template generation...');
    const response = await fetch(`${baseUrl}/admin/ai/generate-template`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ AI template generation successful!');
      console.log('📧 Generated template:');
      console.log(JSON.stringify(result.template, null, 2));
      
      // Check if OpenAI was used
      if (result.template.variables.custom_content && result.template.variables.custom_content.includes('🎉')) {
        console.log('\n🤖 OpenAI integration is working! (Detected AI-generated content)');
      } else {
        console.log('\n⚠️  Using fallback pattern-based generation (OpenAI not configured)');
      }
    } else {
      const error = await response.text();
      console.log('❌ AI template generation failed:');
      console.log(`Status: ${response.status}`);
      console.log(`Error: ${error}`);
    }
    
  } catch (error) {
    console.log('❌ Test failed with error:', error.message);
  }
  
  console.log('\n🎯 AI Playground test completed!');
  console.log('\n📋 To test the full functionality:');
  console.log('1. Set OPENAI_API_KEY in your .env file (optional - will use fallback if not set)');
  console.log('2. Start the server: npm run dev');
  console.log('3. Open http://localhost:3000/admin');
  console.log('4. Navigate to the "AI Playground" tab');
  console.log('5. Try generating different email templates');
  console.log('6. Test the "Send Test Email" functionality');
  console.log('\n🔧 OpenAI Configuration:');
  console.log('- OPENAI_API_KEY: Your OpenAI API key');
  console.log('- OPENAI_MODEL: gpt-4 (default) or gpt-3.5-turbo');
  console.log('- OPENAI_MAX_TOKENS: 2000 (default)');
  console.log('- OPENAI_TEMPERATURE: 0.7 (default)');
}

// Run the test
testAIPlayground().catch(console.error);

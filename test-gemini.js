// Simple test to verify Gemini API integration
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGemini() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY || 'test-key');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const result = await model.generateContent('Hello, this is a test. Please respond with "API connection successful"');
    const response = await result.response;
    console.log('Gemini API Test Result:', response.text());
  } catch (error) {
    console.log('Gemini API Test Error:', error.message);
    console.log('Note: This is expected if no valid API key is provided');
  }
}

testGemini();

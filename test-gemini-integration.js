// Test Gemini API integration
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGeminiAPI() {
  try {
    console.log('🧪 Testing Gemini API integration...');
    
  const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  
  console.log('✅ Gemini AI initialized successfully');
  
  // Test a simple question generation
  const prompt = 'Generate one technical interview question for a React developer. Return only the question text.';
  const result = await model.generateContent(prompt);
  const response = await result.response;
  
  console.log('✅ API Response received:');
  console.log('📝 Generated Question:', response.text());
  console.log('🎉 Gemini API integration is working perfectly!');
  
  } catch (error) {
    console.log('❌ Error testing Gemini API:', error.message);
    console.log('💡 Make sure your API key is valid and has proper permissions');
  }
}

testGeminiAPI();

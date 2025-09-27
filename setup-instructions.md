# Setup Instructions for AI-Powered Interview Assistant

## Quick Setup

### 1. Get Your Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click "Get API Key" in the left sidebar
4. Click "Create API Key" 
5. Copy the generated API key

### 2. Configure the Application
1. Open the `.env` file in the root directory
2. Replace `your-gemini-api-key-here` with your actual API key:
   ```
   REACT_APP_GEMINI_API_KEY=your-actual-api-key-here
   ```

### 3. Start the Application
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Features Available

### Without API Key (Fallback Mode)
- ✅ Resume upload with basic text extraction
- ✅ Static interview questions
- ✅ Mock answer evaluation
- ✅ Basic summary generation
- ✅ All UI functionality

### With API Key (Full AI Mode)
- ✅ AI-powered resume data extraction
- ✅ Dynamic question generation
- ✅ Intelligent answer evaluation
- ✅ AI-generated candidate summaries
- ✅ Enhanced user experience

## Troubleshooting

### If you see "process is not defined" error:
- The webpack configuration has been updated to handle this
- Restart the development server: `npm start`

### If the application doesn't load:
- Check that all dependencies are installed: `npm install`
- Ensure the development server is running on port 3000

### If AI features don't work:
- Verify your API key is correctly set in the `.env` file
- Check the browser console for any error messages
- The application will automatically fall back to mock data if the API key is invalid

## Testing the Application

1. **Upload a Resume**: Try uploading a PDF, DOCX, or TXT file
2. **Complete Profile**: Fill in any missing information
3. **Start Interview**: Answer the 6 questions within time limits
4. **View Results**: Check the Interviewer tab to see candidate scores and summaries

The application works in both modes - with or without the Gemini API key!

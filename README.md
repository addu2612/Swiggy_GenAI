# Swiggy GenAI

A comprehensive feedback analysis application that uses AI to generate insights from employee feedback. This tool helps HR professionals and managers quickly extract key strengths, development areas, and actionable recommendations from textual feedback, with support for voice input and integration with HRMS systems.

## Features

- **Centralized Dashboard**: View all pending feedback requests in one place for employees and managers
- **Voice Feedback Recording**: Record feedback via voice in multiple regional languages, making the process faster and more natural
- **Multi-language Support**: Process feedback in various regional languages to accommodate diverse teams
- **Request Filtering**: Filter feedback requests based on various parameters for better organization
- **Feedback Summary Generation**: Analyze employee feedback to extract key strengths and development areas
- **Improvement Suggestions**: Generate personalized improvement plans based on identified development areas
- **Comprehensive Feedback Analysis**: Provide detailed analysis including summary, strengths, development areas, recommendations, and overall sentiment


## Tech Stack

- **Frontend**: React + Vite
- **AI Integration**: 
  - Ollama API with local LLM models
  - Gemini API support
- **Voice Processing**: Speech-to-text conversion with multi-language support

## Setup Instructions

### Prerequisites

- Node.js and npm/yarn installed
- Ollama installed locally or accessible via network
  - Download from [Ollama's official website](https://ollama.ai/download)
- A compatible LLM model pulled in Ollama 
- Access to speech-to-text API services for voice recognition 

### Environment Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Swiggy_GenAI
   ```

2. Install dependencies:
   ```bash
   # In the frontend directory
   cd frontend
   npm install
   ```

3. Create a `.env` file in the `frontend` directory with the following variables:
   ```
   VITE_OLLAMA_BASE_URL=http://localhost:11434
   VITE_OLLAMA_MODEL=model_name
   VITE_GEMINI_API_KEY='put gemini api key here'
   ```
   
   Adjust the values based on your setup:
   - `VITE_OLLAMA_BASE_URL`: URL where Ollama is running
   - `VITE_OLLAMA_MODEL`: The LLM model you want to use (must be pulled in Ollama first)
   - `VITE_GEMINI_API_KEY`: Gemini API key got from https://aistudio.google.com
   
  
4. Start Ollama (if running locally):
   ```bash
   ollama serve
   ```

5. Pull the required model (if not already available):
   ```bash
   ollama pull llama3
   ```

6. Start the development server:
   ```bash
   # In the frontend directory
   npm run dev
   ```

## User Flow

1. **Dashboard Access**: Users log in to access their personalized dashboard showing pending feedback requests
2. **Feedback Submission**:
   - Text input: Type feedback directly
   - Voice input: Record feedback in preferred language
3. **AI Analysis**: System processes the feedback to extract key insights
4. **Review and Approval**: Users review the AI-generated summary and make any necessary adjustments
5. **HRMS Integration**: Approved feedback is stored and synchronized with the HRMS system

## Supported Languages

The voice feedback system supports multiple regional languages including (but not limited to):
- Hindi
- Tamil
- Telugu
- Kannada
- Bengali
- Marathi
- Gujarati
- Malayalam
- Punjabi
- English



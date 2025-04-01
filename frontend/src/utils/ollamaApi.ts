import API from '../../services/api';

// Interface for the feedback summary
export interface FeedbackSummaryResult {
  strengths: string[];
  developmentAreas: string[];
}

// Interface for the improvement suggestions
export interface ImprovementSuggestionsResult {
  suggestions: string[];
  resources: string[];
  timeframe: string;
  error?: string; // Add optional error property
}

// Interface for the comprehensive feedback analysis
export interface FeedbackAnalysisResult {
  summary: string;
  strengths: string[];
  developmentAreas: string[];
  recommendations: string[];
  sentiment: string;
}

// Get Ollama configuration from environment variables
export const getOllamaConfig = (): { baseUrl: string; model: string } => {
  const baseUrl = import.meta.env.VITE_OLLAMA_BASE_URL || 'http://localhost:11434';
  const model = import.meta.env.VITE_OLLAMA_MODEL || 'llama3';
  
  if (!model) {
    console.warn("Warning: Ollama model name is missing!");
  }
  
  return { baseUrl, model };
};

/**
 * Generate a feedback summary using the Ollama API
 */
export const generateSummary = async (
  feedbackText: string
): Promise<FeedbackSummaryResult> => {
  const { baseUrl, model } = getOllamaConfig();
  if (!model) {
    throw new Error("Ollama model name is required");
  }
  
  try {
    console.log(`Generating summary for feedback using Ollama model: ${model}...`);
    // Define the prompt for Ollama API
    const prompt = `
      Analyze the following employee feedback and extract:
      1. Key strengths (specific capabilities the employee demonstrates well)
      2. Development areas (specific areas where improvement is needed)
      
      Provide only 3-5 items for each category based on the most significant elements in the feedback.
      For each point, provide a concise phrase (not a complete sentence).
      If the feedback is predominantly negative with few or no strengths mentioned, DO NOT invent strengths.
      If the feedback is predominantly positive with few or no development areas, DO NOT invent development areas.
      
      FEEDBACK TEXT:
      ${feedbackText}
      
      FORMAT YOUR RESPONSE AS JSON:
      {
        "strengths": ["strength 1", "strength 2", ...],
        "developmentAreas": ["development area 1", "development area 2", ...]
      }
    `;
    
    // Make the actual call to the Ollama API
    const response = await fetch(`${baseUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.2,
          top_p: 0.8,
          top_k: 40
        }
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Ollama API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }
    
    const result = await response.json();
    
    // Extract the generated text from the response
    const generatedText = result.response;
    
    // Parse the JSON response
    try {
      // First, clean the response to extract just the JSON part
      // This helps if the model outputs any extra text outside the JSON structure
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      const jsonText = jsonMatch ? jsonMatch[0] : generatedText;
      
      return JSON.parse(jsonText);
    } catch (parseError) {
      console.error("Failed to parse Ollama response as JSON:", parseError);
      console.log("Raw response:", generatedText);
      
      // Fallback: If JSON parsing fails, attempt to extract data using regex
      const strengthsMatch = generatedText.match(/"strengths"\s*:\s*\[(.*?)\]/s);
      const developmentMatch = generatedText.match(/"developmentAreas"\s*:\s*\[(.*?)\]/s);
      
      const strengths = strengthsMatch 
        ? strengthsMatch[1].split(',').map(s => s.trim().replace(/^"|"$/g, '').replace(/^"|"$/g, ''))
            .filter(s => s && !s.includes('"strengths"') && !s.includes('"developmentAreas"'))
        : [];
        
      const developmentAreas = developmentMatch
        ? developmentMatch[1].split(',').map(s => s.trim().replace(/^"|"$/g, '').replace(/^"|"$/g, ''))
            .filter(s => s && !s.includes('"strengths"') && !s.includes('"developmentAreas"'))
        : [];
      
      return { strengths, developmentAreas };
    }
  } catch (error) {
    console.error("Error calling Ollama API:", error);
    throw error;
  }
};

/**
 * Generate improvement suggestions based on development areas
 */
export const generateImprovementSuggestions = async (
  developmentAreas: string[],
  employeeName: string,
  role: string = "Employee"
): Promise<ImprovementSuggestionsResult> => {
  const { baseUrl, model } = getOllamaConfig();
  
  if (!model) {
    throw new Error("Ollama model name is required");
  }
  
  try {
    console.log(`Generating improvement suggestions for ${employeeName} using Ollama model: ${model}`);
    
    // Create a prompt for Ollama to generate personalized improvement suggestions
    const areasText = developmentAreas.join(", ");
    const prompt = `
      Create a personalized improvement plan for ${employeeName} who is a ${role}.
      Focus on these development areas: ${areasText}.
      
      Provide:
      1. 3-5 specific, actionable suggestions for improvement
      2. 2-3 learning resources (books, courses, tools) that would help
      3. A reasonable timeframe for showing improvement (30 days, 60 days, 90 days, or 6 months)
      
      Make suggestions that are:
      - Specific and actionable
      - Realistic and practical
      - Appropriate for the employee's role
      
      FORMAT YOUR RESPONSE AS JSON with this exact structure:
      {
        "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"],
        "resources": ["resource 1", "resource 2"],
        "timeframe": "X days/months"
      }
      
      Ensure the response is valid JSON with no trailing commas, properly escaped quotes, and complete arrays.
    `;

    // Make the actual call to the Ollama API
    const response = await fetch(`${baseUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          top_k: 40
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Ollama API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const result = await response.json();
    
    // Extract the generated text from the response
    const generatedText = result.response;
    
    // Clean up the generated text to handle potential formatting issues
    const cleanedText = generatedText
      .replace(/(\r\n|\n|\r)/gm, " ")  // Remove newlines
      .replace(/\s+/g, " ")            // Normalize whitespace
      .trim();
    
    // Parse the JSON response with better error handling
    try {
      // Try to extract JSON by finding opening and closing braces
      const jsonMatch = cleanedText.match(/\{.*\}/s);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      // Direct parsing if the above fails
      return JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("Failed to parse Ollama response as JSON:", parseError);
      
      // Fallback: Extract individual components using regex
      console.log("Attempting regex extraction from raw response:", cleanedText);
      
      // More robust regex patterns
      const suggestionsPattern = /"suggestions"\s*:\s*\[\s*(.*?)\s*\]/s;
      const resourcesPattern = /"resources"\s*:\s*\[\s*(.*?)\s*\]/s;
      const timeframePattern = /"timeframe"\s*:\s*"([^"]*)"/s;
      
      const suggestionsMatch = cleanedText.match(suggestionsPattern);
      const resourcesMatch = cleanedText.match(resourcesPattern);
      const timeframeMatch = cleanedText.match(timeframePattern);
      
      // Process suggestion items
      const suggestions = suggestionsMatch 
        ? suggestionsMatch[1]
            .split(/",\s*"/)
            .map(s => s.replace(/^"/, '').replace(/"$/, '').trim())
            .filter(Boolean)
        : [];
      
      // Process resource items  
      const resources = resourcesMatch
        ? resourcesMatch[1]
            .split(/",\s*"/)
            .map(s => s.replace(/^"/, '').replace(/"$/, '').trim())
            .filter(Boolean)
        : [];
      
      const timeframe = timeframeMatch ? timeframeMatch[1].trim() : "60 days";
      
      return {
        suggestions,
        resources,
        timeframe
      };
    }
  } catch (error) {
    console.error("Error calling Ollama API for suggestions:", error);
    
    // Return a graceful fallback rather than throwing
    return {
      suggestions: ["Improve technical skills", "Enhance communication", "Set clear goals"],
      resources: ["Relevant online course", "Industry-standard book"],
      timeframe: "60 days",
      error: error.message
    };
  }
};

/**
 * Generate a comprehensive feedback analysis using the Ollama API
 */
export const generateFeedbackAnalysis = async (
  feedbackText: string,
  employeeName: string = "",
  role: string = "Employee"
): Promise<FeedbackAnalysisResult> => {
  const { baseUrl, model } = getOllamaConfig();
  if (!model) {
    throw new Error("Ollama model name is required");
  }
  
  try {
    console.log(`Generating comprehensive feedback analysis using Ollama model: ${model}...`);
    
    // Define the prompt for Ollama API
    const prompt = `
      Analyze the following ${role} feedback${employeeName ? ` for ${employeeName}` : ''} and provide:
      
      1. A concise summary of the overall feedback (2-3 sentences)
      2. 3-5 key strengths demonstrated (specific capabilities the person excels at)
      3. 3-5 development areas (specific areas where improvement is needed)
      4. 3-5 actionable recommendations for improvement
      5. The overall sentiment of the feedback (positive, neutral, or negative)
      
      For strengths and development areas, provide concise phrases, not complete sentences.
      If the feedback lacks clear strengths or development areas, only include those that are genuinely present.
      
      FEEDBACK TEXT:
      ${feedbackText}
      
      FORMAT YOUR RESPONSE AS JSON:
      {
        "summary": "Concise summary of the feedback",
        "strengths": ["strength 1", "strength 2", ...],
        "developmentAreas": ["development area 1", "development area 2", ...],
        "recommendations": ["recommendation 1", "recommendation 2", ...],
        "sentiment": "positive/neutral/negative"
      }
    `;
    
    // Make the actual call to the Ollama API
    const response = await fetch(`${baseUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.4,
          top_p: 0.9,
          top_k: 40
        }
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Ollama API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }
    
    const result = await response.json();
    
    // Extract the generated text from the response
    const generatedText = result.response;
    
    // Parse the JSON response
    try {
      // First, clean the response to extract just the JSON part
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      const jsonText = jsonMatch ? jsonMatch[0] : generatedText;
      
      return JSON.parse(jsonText);
    } catch (parseError) {
      console.error("Failed to parse Ollama response as JSON:", parseError);
      console.log("Raw response:", generatedText);
      
      // Fallback: If JSON parsing fails, attempt to extract data using regex
      const summaryMatch = generatedText.match(/"summary"\s*:\s*"([^"]*)"/s);
      const strengthsMatch = generatedText.match(/"strengths"\s*:\s*\[(.*?)\]/s);
      const developmentMatch = generatedText.match(/"developmentAreas"\s*:\s*\[(.*?)\]/s);
      const recommendationsMatch = generatedText.match(/"recommendations"\s*:\s*\[(.*?)\]/s);
      const sentimentMatch = generatedText.match(/"sentiment"\s*:\s*"([^"]*)"/s);
      
      // Extract strings from matches and clean them
      const extractItems = (match: RegExpMatchArray | null): string[] => {
        if (!match) return [];
        return match[1]
          .split(',')
          .map(s => s.trim().replace(/^"|"$/g, ''))
          .filter(s => s && !s.includes('"strengths"') && !s.includes('"developmentAreas"'));
      };
      
      const summary = summaryMatch ? summaryMatch[1].trim() : "Feedback analysis unavailable";
      const strengths = extractItems(strengthsMatch);
      const developmentAreas = extractItems(developmentMatch);
      const recommendations = extractItems(recommendationsMatch);
      const sentiment = sentimentMatch ? sentimentMatch[1].trim() : "neutral";
      
      return {
        summary,
        strengths,
        developmentAreas,
        recommendations,
        sentiment
      };
    }
  } catch (error) {
    console.error("Error calling Ollama API for feedback analysis:", error);
    
    // Return a graceful fallback rather than throwing
    return {
      summary: "Unable to generate feedback analysis due to an error.",
      strengths: [],
      developmentAreas: [],
      recommendations: ["Try analyzing the feedback manually"],
      sentiment: "neutral"
    };
  }
};
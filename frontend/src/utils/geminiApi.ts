import API from '../services/api';

// Interface for the feedback summary
interface FeedbackSummaryResult {
  strengths: string[];
  developmentAreas: string[];
}

// Interface for the improvement suggestions
interface ImprovementSuggestionsResult {
  suggestions: string[];
  resources: string[];
  timeframe: string;
}

// Get API key from environment variable
export const getGeminiApiKey = (): string => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("Warning: Gemini API key is missing!");
    return "";
  }
  return apiKey;
};

/**
 * Generate a feedback summary using the Gemini API
 */
export const generateSummary = async (
  feedbackText: string
): Promise<FeedbackSummaryResult> => {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error("Gemini API key is required");
  }
  
  try {
    console.log("Generating summary for feedback...");
    // Define the prompt for Gemini API
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
    
    // Make the actual call to the Gemini API
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro-exp-03-25:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          topP: 0.8,
          topK: 40
        }
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }
    
    const result = await response.json();
    
    // Extract the generated text from the response
    const generatedText = result.candidates[0].content.parts[0].text;
    
    // Parse the JSON response
    try {
      return JSON.parse(generatedText);
    } catch (parseError) {
      console.error("Failed to parse Gemini response as JSON:", parseError);
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
    console.error("Error calling Gemini API:", error);
    throw error;
  }
};

export const generateImprovementSuggestions = async (
  developmentAreas: string[],
  employeeName: string,
  role: string = "Employee"
): Promise<any> => {
  const apiKey = getGeminiApiKey();
  
  if (!apiKey) {
    throw new Error("Gemini API key is required");
  }
  
  try {
    console.log("Generating improvement suggestions for:", employeeName);
    
    // Create a prompt for Gemini to generate personalized improvement suggestions
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

    // Make the actual call to the Gemini API
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro-exp-03-25:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            topP: 0.9,
            topK: 40,
            responseMimeType: "application/json"  // Explicitly request JSON
          }
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const result = await response.json();
    
    // Extract the generated text from the response
    const generatedText = result.candidates[0].content.parts[0].text;
    
    // Clean up the generated text to handle potential formatting issues
    const cleanedText = generatedText
      .replace(/(\r\n|\n|\r)/gm, " ")  // Remove newlines
      .replace(/\s+/g, " ")            // Normalize whitespace
      .trim();
    
    // Parse the JSON response with better error handling
    try {
      // First try direct JSON parsing
      return JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("Failed to parse Gemini response as JSON:", parseError);
      
      // Try to extract JSON by finding opening and closing braces
      try {
        const jsonMatch = cleanedText.match(/\{.*\}/s);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (extractError) {
        console.error("Failed to extract JSON:", extractError);
      }
      
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
    console.error("Error calling Gemini API for suggestions:", error);
    
    // Return a graceful fallback rather than throwing
    return {
      suggestions: ["Improve technical skills", "Enhance communication", "Set clear goals"],
      resources: ["Relevant online course", "Industry-standard book"],
      timeframe: "60 days",
      error: error.message
    };
  }
};
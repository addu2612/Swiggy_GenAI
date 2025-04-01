import API from './api';
import config from '../config/config';

const HRMSService = {
  /**
   * Export feedback record to HRMS
   * @param {Object} feedbackData - Feedback data to export
   * @returns {Promise} - Response from the API
   */
  exportFeedback: async (feedbackData) => {
    const token = localStorage.getItem('token');
    
    try {
      // First mark the record as exported in our system
      const exportResult = await API.post(`/api/feedback-records/${feedbackData._id}/export`, {}, {
        Authorization: `Bearer ${token}`
      });
      
      // In a real implementation, you would then make an API call to the external HRMS
      // This is just a placeholder for the actual implementation
      
      // Sample implementation of calling an external HRMS API
      const hrmsPayload = {
        employeeId: feedbackData.employeeId || 'N/A',
        employeeName: feedbackData.employeeName,
        assessmentType: 'Feedback',
        assessmentDate: feedbackData.createdAt,
        strengths: feedbackData.summary.strengths,
        developmentAreas: feedbackData.summary.developmentAreas,
        rawFeedback: feedbackData.rawFeedback,
        recommendedActions: feedbackData.improvementSuggestions?.suggestions || []
      };
      
      // Uncomment this in a real implementation
      /*
      const hrmsResponse = await fetch(`${config.HRMS_API_URL}/assessments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.HRMS_API_KEY}`
        },
        body: JSON.stringify(hrmsPayload)
      });
      
      if (!hrmsResponse.ok) {
        const error = await hrmsResponse.json();
        throw new Error(error.message || 'Failed to export to HRMS');
      }
      
      const hrmsResult = await hrmsResponse.json();
      return {
        ...exportResult,
        hrmsReferenceId: hrmsResult.referenceId
      };
      */
      
      // Mock successful HRMS export for now
      return {
        success: true,
        data: {
          ...feedbackData,
          hrmsExported: true,
          hrmsExportedAt: new Date().toISOString(),
          hrmsReferenceId: `HRMS-${Date.now()}`
        },
        message: 'Successfully exported to HRMS'
      };
    } catch (error) {
      console.error('HRMS export error:', error);
      throw error;
    }
  },
  
  /**
   * Validate employee ID in HRMS
   * @param {string} employeeId - ID to validate
   * @returns {Promise} - True if valid, false otherwise
   */
  validateEmployeeId: async (employeeId) => {
    // In a real implementation, you would validate against the HRMS
    // This is just a placeholder that always returns true
    
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    
    return {
      success: true,
      data: {
        valid: true,
        employeeInfo: {
          name: 'John Doe',
          department: 'Engineering',
          position: 'Senior Developer'
        }
      }
    };
  }
};

export default HRMSService;

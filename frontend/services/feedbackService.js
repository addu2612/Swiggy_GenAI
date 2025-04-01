import API from './api';

const FeedbackService = {
  /**
   * Create a new feedback
   * @param {Object} feedbackData - Feedback data to be created
   * @returns {Promise} - Response from the API
   */
  createFeedback: (feedbackData) => {
    const token = localStorage.getItem('token');
    return API.post('/api/feedback', feedbackData, {
      Authorization: `Bearer ${token}`
    });
  },

  /**
   * Get all feedback with optional filters
   * @param {Object} filters - Optional filters (status, category, priority, search)
   * @returns {Promise} - Response from the API
   */
  getAllFeedback: (filters = {}) => {
    const token = localStorage.getItem('token');
    // Convert filters object to query string
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return API.get(`/api/feedback${queryString}`, {
      Authorization: `Bearer ${token}`
    });
  },

  /**
   * Get a specific feedback by its ID
   * @param {string} id - Feedback ID
   * @returns {Promise} - Response from the API
   */
  getFeedbackById: (id) => {
    const token = localStorage.getItem('token');
    return API.get(`/api/feedback/${id}`, {
      Authorization: `Bearer ${token}`
    });
  },

  /**
   * Update an existing feedback
   * @param {string} id - Feedback ID
   * @param {Object} feedbackData - Updated feedback data
   * @returns {Promise} - Response from the API
   */
  updateFeedback: (id, feedbackData) => {
    const token = localStorage.getItem('token');
    return API.put(`/api/feedback/${id}`, feedbackData, {
      Authorization: `Bearer ${token}`
    });
  },

  /**
   * Delete a feedback
   * @param {string} id - Feedback ID to delete
   * @returns {Promise} - Response from the API
   */
  deleteFeedback: (id) => {
    const token = localStorage.getItem('token');
    return API.delete(`/api/feedback/${id}`, {
      Authorization: `Bearer ${token}`
    });
  },
};

export default FeedbackService;

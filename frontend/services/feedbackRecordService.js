import API from './api';

const FeedbackRecordService = {
  /**
   * Create a new feedback record
   * @param {Object} data - Feedback record data
   * @returns {Promise} - Response from the API
   */
  createFeedbackRecord: (data) => {
    const token = localStorage.getItem('token');
    return API.post('/api/feedback-records', data, {
      Authorization: `Bearer ${token}`
    });
  },

  /**
   * Search feedback records with optional filters
   * @param {Object} filters - Optional filters (searchTerm, employeeName, startDate, endDate, etc.)
   * @returns {Promise} - Response from the API
   */
  searchFeedbackRecords: (filters = {}) => {
    const token = localStorage.getItem('token');
    
    // Convert filters object to query string
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value);
      }
    });
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return API.get(`/api/feedback-records${queryString}`, {
      Authorization: `Bearer ${token}`
    });
  },

  /**
   * Get a feedback record by ID
   * @param {string} id - Feedback record ID
   * @returns {Promise} - Response from the API
   */
  getFeedbackRecordById: (id) => {
    const token = localStorage.getItem('token');
    return API.get(`/api/feedback-records/${id}`, {
      Authorization: `Bearer ${token}`
    });
  },

  /**
   * Update a feedback record
   * @param {string} id - Feedback record ID
   * @param {Object} data - Updated data
   * @returns {Promise} - Response from the API
   */
  updateFeedbackRecord: (id, data) => {
    const token = localStorage.getItem('token');
    return API.put(`/api/feedback-records/${id}`, data, {
      Authorization: `Bearer ${token}`
    });
  },

  /**
   * Delete a feedback record
   * @param {string} id - Feedback record ID
   * @returns {Promise} - Response from the API
   */
  deleteFeedbackRecord: (id) => {
    const token = localStorage.getItem('token');
    return API.delete(`/api/feedback-records/${id}`, {
      Authorization: `Bearer ${token}`
    });
  },

  /**
   * Export a feedback record to HRMS
   * @param {string} id - Feedback record ID
   * @returns {Promise} - Response from the API
   */
  exportToHRMS: (id) => {
    const token = localStorage.getItem('token');
    return API.post(`/api/feedback-records/${id}/export`, {}, {
      Authorization: `Bearer ${token}`
    });
  }
};

export default FeedbackRecordService;

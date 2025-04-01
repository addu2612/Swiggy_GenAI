const FeedbackRecord = require('../models/FeedbackRecord');
const JsonResponse = require('../helper/JsonResponse');
const { ObjectId } = require('mongodb');

exports.createFeedbackRecord = async (req, res) => {
  try {
    const { 
      employeeName, 
      employeeRole,
      rawFeedback, 
      summary, 
      improvementSuggestions,
      tags 
    } = req.body;
    
    if (!employeeName || !rawFeedback) {
      res.locals.message = 'Employee name and feedback text are required';
      res.locals.status_code = 400;
      return new JsonResponse(req, res).jsonError();
    }
    
    const feedbackRecord = new FeedbackRecord({
      employeeName,
      employeeRole: employeeRole || 'Employee',
      rawFeedback,
      summary: summary || { strengths: [], developmentAreas: [] },
      improvementSuggestions,
      tags: tags || [],
      createdBy: req.apiUser.id
    });
    
    const result = await feedbackRecord.create();
    
    return new JsonResponse(req, res).jsonSuccess(
      { ...feedbackRecord, _id: result.insertedId },
      'Feedback record created successfully'
    );
  } catch (error) {
    res.locals.message = error.message;
    res.locals.status_code = 500;
    return new JsonResponse(req, res).jsonError();
  }
};

exports.searchFeedbackRecords = async (req, res) => {
  try {
    const result = await FeedbackRecord.search(req.query);
    
    return new JsonResponse(req, res).jsonSuccess(
      result,
      'Feedback records retrieved successfully'
    );
  } catch (error) {
    res.locals.message = error.message;
    res.locals.status_code = 500;
    return new JsonResponse(req, res).jsonError();
  }
};

exports.getFeedbackRecordById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
      res.locals.message = 'Invalid record ID';
      res.locals.status_code = 400;
      return new JsonResponse(req, res).jsonError();
    }
    
    const feedbackRecord = await FeedbackRecord.findById(id);
    
    if (!feedbackRecord) {
      res.locals.message = 'Feedback record not found';
      res.locals.status_code = 404;
      return new JsonResponse(req, res).jsonError();
    }
    
    // Regular users can only access records they created
    if (req.apiUser.role !== 'admin' && feedbackRecord.createdBy !== req.apiUser.id) {
      res.locals.message = 'Unauthorized to access this record';
      res.locals.status_code = 403;
      return new JsonResponse(req, res).jsonError();
    }
    
    return new JsonResponse(req, res).jsonSuccess(
      feedbackRecord,
      'Feedback record retrieved successfully'
    );
  } catch (error) {
    res.locals.message = error.message;
    res.locals.status_code = 500;
    return new JsonResponse(req, res).jsonError();
  }
};

exports.updateFeedbackRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    if (!ObjectId.isValid(id)) {
      res.locals.message = 'Invalid record ID';
      res.locals.status_code = 400;
      return new JsonResponse(req, res).jsonError();
    }
    
    const feedbackRecord = await FeedbackRecord.findById(id);
    
    if (!feedbackRecord) {
      res.locals.message = 'Feedback record not found';
      res.locals.status_code = 404;
      return new JsonResponse(req, res).jsonError();
    }
    
    // Regular users can only update records they created
    if (req.apiUser.role !== 'admin' && feedbackRecord.createdBy !== req.apiUser.id) {
      res.locals.message = 'Unauthorized to update this record';
      res.locals.status_code = 403;
      return new JsonResponse(req, res).jsonError();
    }
    
    await FeedbackRecord.update(id, updateData);
    
    const updatedRecord = await FeedbackRecord.findById(id);
    
    return new JsonResponse(req, res).jsonSuccess(
      updatedRecord,
      'Feedback record updated successfully'
    );
  } catch (error) {
    res.locals.message = error.message;
    res.locals.status_code = 500;
    return new JsonResponse(req, res).jsonError();
  }
};

exports.deleteFeedbackRecord = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
      res.locals.message = 'Invalid record ID';
      res.locals.status_code = 400;
      return new JsonResponse(req, res).jsonError();
    }
    
    const feedbackRecord = await FeedbackRecord.findById(id);
    
    if (!feedbackRecord) {
      res.locals.message = 'Feedback record not found';
      res.locals.status_code = 404;
      return new JsonResponse(req, res).jsonError();
    }
    
    // Regular users can only delete records they created
    if (req.apiUser.role !== 'admin' && feedbackRecord.createdBy !== req.apiUser.id) {
      res.locals.message = 'Unauthorized to delete this record';
      res.locals.status_code = 403;
      return new JsonResponse(req, res).jsonError();
    }
    
    await FeedbackRecord.delete(id);
    
    return new JsonResponse(req, res).jsonSuccess(
      { id },
      'Feedback record deleted successfully'
    );
  } catch (error) {
    res.locals.message = error.message;
    res.locals.status_code = 500;
    return new JsonResponse(req, res).jsonError();
  }
};

exports.exportToHRMS = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
      res.locals.message = 'Invalid record ID';
      res.locals.status_code = 400;
      return new JsonResponse(req, res).jsonError();
    }
    
    const feedbackRecord = await FeedbackRecord.findById(id);
    
    if (!feedbackRecord) {
      res.locals.message = 'Feedback record not found';
      res.locals.status_code = 404;
      return new JsonResponse(req, res).jsonError();
    }
    
    // Only admin can export to HRMS
    if (req.apiUser.role !== 'admin') {
      res.locals.message = 'Unauthorized to export to HRMS';
      res.locals.status_code = 403;
      return new JsonResponse(req, res).jsonError();
    }
    
    // Mark as exported
    await FeedbackRecord.markAsExported(id);
    
    // In a real implementation, you would make an API call to the HRMS here
    // For now, we'll just simulate a successful export
    
    return new JsonResponse(req, res).jsonSuccess(
      { id, exportedAt: new Date() },
      'Feedback record exported to HRMS successfully'
    );
  } catch (error) {
    res.locals.message = error.message;
    res.locals.status_code = 500;
    return new JsonResponse(req, res).jsonError();
  }
};

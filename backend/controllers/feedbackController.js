const Feedback = require('../models/Feedback');
const JsonResponse = require('../helper/JsonResponse');
const { ObjectId } = require('mongodb');

exports.createFeedback = async (req, res) => {
  try {
    const { title, description, category, priority, audioRecording, attachments } = req.body;
    
    if (!title || !description) {
      res.locals.message = 'Title and description are required';
      res.locals.status_code = 400;
      return new JsonResponse(req, res).jsonError();
    }
    
    const feedback = new Feedback({
      title,
      description,
      category, 
      priority,
      userId: req.apiUser.id,
      audioRecording,
      attachments
    });
    
    const result = await feedback.create();
    
    return new JsonResponse(req, res).jsonSuccess(
      { ...feedback, _id: result.insertedId },
      'Feedback created successfully'
    );
  } catch (error) {
    res.locals.message = error.message;
    res.locals.status_code = 500;
    return new JsonResponse(req, res).jsonError();
  }
};

exports.getAllFeedback = async (req, res) => {
  try {
    const { status, category, priority, search } = req.query;
    const filters = {};
    
    // Apply filters if provided
    if (status) filters.status = status;
    if (category) filters.category = category;
    if (priority) filters.priority = priority;
    
    // Apply text search if provided
    if (search) {
      filters.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // For regular users, only show their feedback
    if (req.apiUser.role !== 'admin') {
      filters.userId = req.apiUser.id;
    }
    
    const feedbacks = await Feedback.findAll(filters);
    
    return new JsonResponse(req, res).jsonSuccess(
      feedbacks,
      'Feedbacks retrieved successfully'
    );
  } catch (error) {
    res.locals.message = error.message;
    res.locals.status_code = 500;
    return new JsonResponse(req, res).jsonError();
  }
};

exports.getFeedbackById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
      res.locals.message = 'Invalid feedback ID';
      res.locals.status_code = 400;
      return new JsonResponse(req, res).jsonError();
    }
    
    const feedback = await Feedback.findById(id);
    
    if (!feedback) {
      res.locals.message = 'Feedback not found';
      res.locals.status_code = 404;
      return new JsonResponse(req, res).jsonError();
    }
    
    // Regular users can only view their own feedback
    if (req.apiUser.role !== 'admin' && feedback.userId !== req.apiUser.id) {
      res.locals.message = 'Unauthorized to access this feedback';
      res.locals.status_code = 403;
      return new JsonResponse(req, res).jsonError();
    }
    
    return new JsonResponse(req, res).jsonSuccess(
      feedback,
      'Feedback retrieved successfully'
    );
  } catch (error) {
    res.locals.message = error.message;
    res.locals.status_code = 500;
    return new JsonResponse(req, res).jsonError();
  }
};

exports.updateFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, category, priority, assignedTo } = req.body;
    
    if (!ObjectId.isValid(id)) {
      res.locals.message = 'Invalid feedback ID';
      res.locals.status_code = 400;
      return new JsonResponse(req, res).jsonError();
    }
    
    const feedback = await Feedback.findById(id);
    
    if (!feedback) {
      res.locals.message = 'Feedback not found';
      res.locals.status_code = 404;
      return new JsonResponse(req, res).jsonError();
    }
    
    // Regular users can only update their own feedback and cannot change assignee
    if (req.apiUser.role !== 'admin') {
      if (feedback.userId !== req.apiUser.id) {
        res.locals.message = 'Unauthorized to update this feedback';
        res.locals.status_code = 403;
        return new JsonResponse(req, res).jsonError();
      }
      
      // Remove admin-only fields
      delete req.body.assignedTo;
      delete req.body.status;
    }
    
    const updateData = { ...req.body };
    await Feedback.update(id, updateData);
    
    const updatedFeedback = await Feedback.findById(id);
    
    return new JsonResponse(req, res).jsonSuccess(
      updatedFeedback,
      'Feedback updated successfully'
    );
  } catch (error) {
    res.locals.message = error.message;
    res.locals.status_code = 500;
    return new JsonResponse(req, res).jsonError();
  }
};

exports.deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
      res.locals.message = 'Invalid feedback ID';
      res.locals.status_code = 400;
      return new JsonResponse(req, res).jsonError();
    }
    
    const feedback = await Feedback.findById(id);
    
    if (!feedback) {
      res.locals.message = 'Feedback not found';
      res.locals.status_code = 404;
      return new JsonResponse(req, res).jsonError();
    }
    
    // Only admin or the creator can delete feedback
    if (req.apiUser.role !== 'admin' && feedback.userId !== req.apiUser.id) {
      res.locals.message = 'Unauthorized to delete this feedback';
      res.locals.status_code = 403;
      return new JsonResponse(req, res).jsonError();
    }
    
    await Feedback.delete(id);
    
    return new JsonResponse(req, res).jsonSuccess(
      { id },
      'Feedback deleted successfully'
    );
  } catch (error) {
    res.locals.message = error.message;
    res.locals.status_code = 500;
    return new JsonResponse(req, res).jsonError();
  }
};

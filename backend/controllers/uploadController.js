const fs = require('fs');
const path = require('path');
const JsonResponse = require('../helper/JsonResponse');
const Messages = require('../constants/Message');

const messages = new Messages();

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      res.locals.message = 'No file uploaded';
      res.locals.status_code = 400;
      return new JsonResponse(req, res).jsonError();
    }

    // File has been saved by multer middleware
    const fileUrl = `/uploads/${req.file.filename}`;
    
    return new JsonResponse(req, res).jsonSuccess(
      { fileUrl },
      messages.UPLOAD_SUCCESS
    );
  } catch (error) {
    res.locals.message = error.message;
    res.locals.status_code = 500;
    return new JsonResponse(req, res).jsonError();
  }
};

exports.uploadAudio = async (req, res) => {
  try {
    if (!req.file) {
      res.locals.message = 'No audio file uploaded';
      res.locals.status_code = 400;
      return new JsonResponse(req, res).jsonError();
    }

    // File has been saved by multer middleware
    const audioUrl = `/uploads/audio/${req.file.filename}`;
    
    return new JsonResponse(req, res).jsonSuccess(
      { audioUrl },
      messages.UPLOAD_SUCCESS
    );
  } catch (error) {
    res.locals.message = error.message;
    res.locals.status_code = 500;
    return new JsonResponse(req, res).jsonError();
  }
};

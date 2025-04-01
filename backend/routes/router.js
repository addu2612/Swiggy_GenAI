const express = require('express');
const router = express.Router();
const TryCatch = require('../helper/TryCatch');
const { verifyToken, adminOnly } = require('../middleware/authMiddleware');
const { uploadFile, uploadAudio } = require('../middleware/upload');

// Import controllers
const authController = require('../controllers/authController');
const feedbackController = require('../controllers/feedbackController');
const uploadController = require('../controllers/uploadController');
const feedbackRecordController = require('../controllers/feedbackRecordController');

// Health check route
router.get("/health-check", (req, res) => {
  res.json("Server Health: OK");
});

// Auth routes
router.post("/auth/register", new TryCatch(authController.register).tryCatchGlobe());
router.post("/auth/login", new TryCatch(authController.login).tryCatchGlobe());
router.get("/auth/profile", verifyToken, new TryCatch(authController.getProfile).tryCatchGlobe());

// Feedback routes
router.post("/feedback", verifyToken, new TryCatch(feedbackController.createFeedback).tryCatchGlobe());
router.get("/feedback", verifyToken, new TryCatch(feedbackController.getAllFeedback).tryCatchGlobe());
router.get("/feedback/:id", verifyToken, new TryCatch(feedbackController.getFeedbackById).tryCatchGlobe());
router.put("/feedback/:id", verifyToken, new TryCatch(feedbackController.updateFeedback).tryCatchGlobe());
router.delete("/feedback/:id", verifyToken, new TryCatch(feedbackController.deleteFeedback).tryCatchGlobe());

// Upload routes
router.post("/upload/file", verifyToken, uploadFile, new TryCatch(uploadController.uploadFile).tryCatchGlobe());
router.post("/upload/audio", verifyToken, uploadAudio, new TryCatch(uploadController.uploadAudio).tryCatchGlobe());

// Feedback Record routes
router.post("/feedback-records", verifyToken, new TryCatch(feedbackRecordController.createFeedbackRecord).tryCatchGlobe());
router.get("/feedback-records", verifyToken, new TryCatch(feedbackRecordController.searchFeedbackRecords).tryCatchGlobe());
router.get("/feedback-records/:id", verifyToken, new TryCatch(feedbackRecordController.getFeedbackRecordById).tryCatchGlobe());
router.put("/feedback-records/:id", verifyToken, new TryCatch(feedbackRecordController.updateFeedbackRecord).tryCatchGlobe());
router.delete("/feedback-records/:id", verifyToken, new TryCatch(feedbackRecordController.deleteFeedbackRecord).tryCatchGlobe());
router.post("/feedback-records/:id/export", verifyToken, adminOnly, new TryCatch(feedbackRecordController.exportToHRMS).tryCatchGlobe());

// Admin routes
router.get("/admin/stats", verifyToken, adminOnly, (req, res) => {
  res.json({
    message: "Admin stats endpoint"
  });
});

module.exports = router;
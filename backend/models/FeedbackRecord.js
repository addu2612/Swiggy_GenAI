const { ObjectId } = require('mongodb');
const client = require('../db');

const db = client.db('swigz');
const feedbackRecordsCollection = db.collection('feedbackRecords');

class FeedbackRecord {
  constructor(data) {
    this.employeeName = data.employeeName;
    this.employeeRole = data.employeeRole || 'Employee';
    this.rawFeedback = data.rawFeedback;
    this.summary = data.summary || {
      strengths: [],
      developmentAreas: []
    };
    this.improvementSuggestions = data.improvementSuggestions || null;
    this.createdBy = data.createdBy; // User ID of the person who created the record
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this.hrmsExported = data.hrmsExported || false;
    this.hrmsExportedAt = data.hrmsExportedAt || null;
    this.tags = data.tags || [];
  }

  async create() {
    return await feedbackRecordsCollection.insertOne(this);
  }

  static async findById(id) {
    return await feedbackRecordsCollection.findOne({ _id: new ObjectId(id) });
  }

  static async findByCreator(userId) {
    return await feedbackRecordsCollection.find({ createdBy: userId }).sort({ createdAt: -1 }).toArray();
  }

  static async search(query = {}, options = {}) {
    const { 
      searchTerm,
      employeeName, 
      createdBy, 
      startDate, 
      endDate, 
      isExported,
      sortBy,
      sortOrder,
      page = 1,
      limit = 10 
    } = query;
    
    const filter = {};
    
    // Apply filters if provided
    if (employeeName) filter.employeeName = { $regex: employeeName, $options: 'i' };
    if (createdBy) filter.createdBy = createdBy;
    
    // Date range filter
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }
    
    // HRMS export filter
    if (isExported !== undefined) filter.hrmsExported = isExported === 'true';
    
    // Text search across multiple fields
    if (searchTerm) {
      filter.$or = [
        { employeeName: { $regex: searchTerm, $options: 'i' } },
        { employeeRole: { $regex: searchTerm, $options: 'i' } },
        { rawFeedback: { $regex: searchTerm, $options: 'i' } },
        { tags: { $in: [new RegExp(searchTerm, 'i')] } }
      ];
    }

    // Default sort by creation date, newest first
    const sortOptions = {};
    sortOptions[sortBy || 'createdAt'] = sortOrder === 'asc' ? 1 : -1;
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Get total count for pagination
    const total = await feedbackRecordsCollection.countDocuments(filter);
    
    // Get paginated results
    const records = await feedbackRecordsCollection
      .find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .toArray();
    
    return {
      records,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    };
  }

  static async update(id, updateData) {
    updateData.updatedAt = new Date();
    return await feedbackRecordsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
  }

  static async delete(id) {
    return await feedbackRecordsCollection.deleteOne({ _id: new ObjectId(id) });
  }
  
  static async markAsExported(id) {
    return await feedbackRecordsCollection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          hrmsExported: true, 
          hrmsExportedAt: new Date() 
        } 
      }
    );
  }
}

module.exports = FeedbackRecord;

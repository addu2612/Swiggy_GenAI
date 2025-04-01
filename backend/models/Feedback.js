const { ObjectId } = require('mongodb');
const client = require('../db');

const db = client.db('swigz');
const feedbackCollection = db.collection('feedback');

class Feedback {
  constructor(data) {
    this.title = data.title;
    this.description = data.description;
    this.status = data.status || 'pending'; // pending, in-progress, resolved
    this.category = data.category || 'general';
    this.priority = data.priority || 'medium'; // low, medium, high
    this.userId = data.userId;
    this.assignedTo = data.assignedTo || null;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this.attachments = data.attachments || [];
    this.audioRecording = data.audioRecording || null;
  }

  async create() {
    return await feedbackCollection.insertOne(this);
  }

  static async findById(id) {
    return await feedbackCollection.findOne({ _id: new ObjectId(id) });
  }

  static async findByUserId(userId) {
    return await feedbackCollection.find({ userId }).toArray();
  }

  static async findAll(filters = {}) {
    return await feedbackCollection.find(filters).toArray();
  }

  static async update(id, updateData) {
    updateData.updatedAt = new Date();
    return await feedbackCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
  }

  static async delete(id) {
    return await feedbackCollection.deleteOne({ _id: new ObjectId(id) });
  }
}

module.exports = Feedback;

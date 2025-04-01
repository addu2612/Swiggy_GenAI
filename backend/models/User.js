const { ObjectId } = require('mongodb');
const client = require('../db');
const bcrypt = require('bcryptjs');

const db = client.db('swigz');
const usersCollection = db.collection('users');

class User {
  constructor(data) {
    this.email = data.email;
    this.password = data.password;
    this.name = data.name;
    this.role = data.role || 'user'; // admin, user
    this.createdAt = data.createdAt || new Date();
    this.profilePicture = data.profilePicture || '';
  }

  async register() {
    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email: this.email });
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    // Insert user to database
    return await usersCollection.insertOne(this);
  }

  static async findByEmail(email) {
    return await usersCollection.findOne({ email });
  }

  static async findById(id) {
    return await usersCollection.findOne({ _id: new ObjectId(id) });
  }

  static async comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }
}

module.exports = User;

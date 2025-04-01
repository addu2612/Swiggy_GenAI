const client = require('../db');

async function viewData() {
  try {
    // Wait for connection to be established
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const db = client.db('swigz');
    
    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    
    // View users
    const users = await db.collection('users').find({}).toArray();
    console.log('\nUsers:', users);
    
    // View feedback
    const feedback = await db.collection('feedback').find({}).toArray();
    console.log('\nFeedback:', feedback);
    
    // Close connection
    await client.close();
  } catch (error) {
    console.error('Error viewing data:', error);
  }
}

viewData();

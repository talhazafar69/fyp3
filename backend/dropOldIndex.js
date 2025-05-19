const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('MongoDB connected');
    
    try {
      // Get the ChatLog collection
      const db = mongoose.connection.db;
      const collection = db.collection('chatlogs');
      
      // Drop the old session_id index
      await collection.dropIndex('session_id_1');
      console.log('Successfully dropped session_id_1 index');
    } catch (error) {
      console.error('Error dropping index:', error);
    } finally {
      // Close the connection
      mongoose.connection.close();
      console.log('MongoDB connection closed');
    }
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
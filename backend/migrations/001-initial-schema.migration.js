const mongoose = require('mongoose');

/**
 * Initial Schema Migration
 * This migration ensures all collections have proper indexes
 */
module.exports = {
  async up() {
    const db = mongoose.connection.db;
    
    // Create indexes for Users collection
    const usersCollection = db.collection('users');
    await usersCollection.createIndex({ email: 1 }, { unique: true });
    await usersCollection.createIndex({ role: 1 });
    await usersCollection.createIndex({ createdAt: 1 });
    
    // Create indexes for Orders collection
    const ordersCollection = db.collection('orders');
    await ordersCollection.createIndex({ userId: 1 });
    await ordersCollection.createIndex({ paymentStatus: 1 });
    await ordersCollection.createIndex({ createdAt: 1 });
    await ordersCollection.createIndex({ stripePaymentId: 1 });
    await ordersCollection.createIndex({ stripeSessionId: 1 });
    
    console.log('✓ Created indexes for users and orders collections');
  },
  
  async down() {
    const db = mongoose.connection.db;
    
    // Drop indexes (optional - usually not needed)
    const usersCollection = db.collection('users');
    const ordersCollection = db.collection('orders');
    
    try {
      await usersCollection.dropIndex('email_1');
      await usersCollection.dropIndex('role_1');
      await usersCollection.dropIndex('createdAt_1');
      
      await ordersCollection.dropIndex('userId_1');
      await ordersCollection.dropIndex('paymentStatus_1');
      await ordersCollection.dropIndex('createdAt_1');
      await ordersCollection.dropIndex('stripePaymentId_1');
      await ordersCollection.dropIndex('stripeSessionId_1');
      
      console.log('✓ Dropped indexes');
    } catch (error) {
      console.log('Note: Some indexes may not exist');
    }
  }
};


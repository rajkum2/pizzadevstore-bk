const Order = require('../models/Order');
const User = require('../models/User');

/**
 * Orders Seeder
 * Seeds sample orders for testing
 */
module.exports = {
  async seed() {
    // Get users to associate orders with
    const users = await User.find({ role: 'user' }).limit(3);
    
    if (users.length === 0) {
      console.log('  ⚠ No users found. Please run users seeder first.');
      return;
    }

    const pizzaMenu = [
      { name: 'Margherita', price: 10 },
      { name: 'Pepperoni', price: 12 },
      { name: 'Veggie', price: 11 },
      { name: 'Hawaiian', price: 13 },
      { name: 'Meat Lovers', price: 15 },
      { name: 'BBQ Chicken', price: 14 }
    ];

    const orders = [
      {
        userId: users[0]._id,
        pizzas: [
          { name: 'Margherita', quantity: 2, price: 10 },
          { name: 'Pepperoni', quantity: 1, price: 12 }
        ],
        totalAmount: 32,
        paymentStatus: 'paid',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
      },
      {
        userId: users[0]._id,
        pizzas: [
          { name: 'Hawaiian', quantity: 1, price: 13 },
          { name: 'BBQ Chicken', quantity: 2, price: 14 }
        ],
        totalAmount: 41,
        paymentStatus: 'paid',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
      },
      {
        userId: users[0]._id,
        pizzas: [
          { name: 'Veggie', quantity: 1, price: 11 }
        ],
        totalAmount: 11,
        paymentStatus: 'pending',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
      },
      {
        userId: users[1]?._id || users[0]._id,
        pizzas: [
          { name: 'Meat Lovers', quantity: 1, price: 15 },
          { name: 'Pepperoni', quantity: 1, price: 12 }
        ],
        totalAmount: 27,
        paymentStatus: 'paid',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
      },
      {
        userId: users[1]?._id || users[0]._id,
        pizzas: [
          { name: 'Margherita', quantity: 3, price: 10 }
        ],
        totalAmount: 30,
        paymentStatus: 'shipped',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      },
      {
        userId: users[2]?._id || users[0]._id,
        pizzas: [
          { name: 'BBQ Chicken', quantity: 1, price: 14 },
          { name: 'Hawaiian', quantity: 1, price: 13 },
          { name: 'Veggie', quantity: 1, price: 11 }
        ],
        totalAmount: 38,
        paymentStatus: 'paid',
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) // 4 days ago
      }
    ];

    let createdCount = 0;
    let skippedCount = 0;

    for (const orderData of orders) {
      try {
        // Check if similar order already exists (same user, same total, same date)
        const existingOrder = await Order.findOne({
          userId: orderData.userId,
          totalAmount: orderData.totalAmount,
          createdAt: {
            $gte: new Date(orderData.createdAt.getTime() - 1000),
            $lte: new Date(orderData.createdAt.getTime() + 1000)
          }
        });

        if (existingOrder) {
          console.log(`  ⚠ Similar order already exists, skipping...`);
          skippedCount++;
          continue;
        }

        const order = new Order(orderData);
        await order.save();
        console.log(`  ✓ Created order: ${order._id} (${order.paymentStatus}) - $${order.totalAmount}`);
        createdCount++;
      } catch (error) {
        console.error(`  ✗ Failed to create order:`, error.message);
      }
    }

    console.log(`\n  Summary: ${createdCount} created, ${skippedCount} skipped`);
  },

  async clear() {
    // Remove all seeded orders (or orders with specific characteristics)
    // This will remove all orders - be careful in production!
    const result = await Order.deleteMany({});
    console.log(`  ✓ Removed ${result.deletedCount} orders`);
    
    // Alternative: Only remove test orders (uncomment if you want to be more selective)
    // const testUsers = await User.find({ 
    //   email: { $in: ['user1@example.com', 'user2@example.com', 'john@example.com', 'jane@example.com'] }
    // });
    // const testUserIds = testUsers.map(u => u._id);
    // const result = await Order.deleteMany({ userId: { $in: testUserIds } });
    // console.log(`  ✓ Removed ${result.deletedCount} test orders`);
  }
};


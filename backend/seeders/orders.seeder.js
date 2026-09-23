const supabase = require('../config/supabase');
const Order = require('../models/Order');

/**
 * Orders Seeder
 * Seeds sample orders for testing
 */
module.exports = {
  async seed() {
    // Get users to associate orders with
    const { data: users, error } = await supabase
      .from('users')
      .select('id')
      .eq('role', 'user')
      .limit(3);

    if (error) throw error;

    if (!users || users.length === 0) {
      console.log('  ⚠ No users found. Please run users seeder first.');
      return;
    }

    const orders = [
      {
        userId: users[0].id,
        pizzas: [
          { name: 'Margherita', quantity: 2, price: 10 },
          { name: 'Pepperoni', quantity: 1, price: 12 }
        ],
        totalAmount: 32,
        paymentStatus: 'paid',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days ago
      },
      {
        userId: users[0].id,
        pizzas: [
          { name: 'Hawaiian', quantity: 1, price: 13 },
          { name: 'BBQ Chicken', quantity: 2, price: 14 }
        ],
        totalAmount: 41,
        paymentStatus: 'paid',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
      },
      {
        userId: users[0].id,
        pizzas: [
          { name: 'Veggie', quantity: 1, price: 11 }
        ],
        totalAmount: 11,
        paymentStatus: 'pending',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
      },
      {
        userId: (users[1] || users[0]).id,
        pizzas: [
          { name: 'Meat Lovers', quantity: 1, price: 15 },
          { name: 'Pepperoni', quantity: 1, price: 12 }
        ],
        totalAmount: 27,
        paymentStatus: 'paid',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago
      },
      {
        userId: (users[1] || users[0]).id,
        pizzas: [
          { name: 'Margherita', quantity: 3, price: 10 }
        ],
        totalAmount: 30,
        paymentStatus: 'shipped',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
      },
      {
        userId: (users[2] || users[0]).id,
        pizzas: [
          { name: 'BBQ Chicken', quantity: 1, price: 14 },
          { name: 'Hawaiian', quantity: 1, price: 13 },
          { name: 'Veggie', quantity: 1, price: 11 }
        ],
        totalAmount: 38,
        paymentStatus: 'paid',
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() // 4 days ago
      }
    ];

    let createdCount = 0;
    let skippedCount = 0;

    for (const orderData of orders) {
      try {
        // Check if similar order already exists (same user, same total, same day)
        const dayStart = new Date(orderData.createdAt);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(orderData.createdAt);
        dayEnd.setHours(23, 59, 59, 999);

        const { data: existingOrders, error: findError } = await supabase
          .from('orders')
          .select('id')
          .eq('user_id', orderData.userId)
          .eq('total_amount', orderData.totalAmount)
          .gte('created_at', dayStart.toISOString())
          .lte('created_at', dayEnd.toISOString());

        if (findError) throw findError;

        if (existingOrders && existingOrders.length > 0) {
          console.log('  ⚠ Similar order already exists, skipping...');
          skippedCount++;
          continue;
        }

        const order = await Order.create(orderData);
        console.log(`  ✓ Created order: ${order._id} (${order.paymentStatus}) - $${order.totalAmount}`);
        createdCount++;
      } catch (error) {
        console.error('  ✗ Failed to create order:', error.message);
      }
    }

    console.log(`\n  Summary: ${createdCount} created, ${skippedCount} skipped`);
  },

  async clear() {
    // Remove all orders - be careful in production!
    const { error, count } = await supabase
      .from('orders')
      .delete({ count: 'exact' })
      .not('id', 'is', null);

    if (error) throw error;
    console.log(`  ✓ Removed ${count} orders`);
  }
};

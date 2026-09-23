const supabase = require('../config/supabase');
const User = require('../models/User');

/**
 * Users Seeder
 * Seeds initial users including admin and test users
 */
module.exports = {
  async seed() {
    const users = [
      {
        email: 'admin@pizza.com',
        password: 'admin123',
        role: 'admin'
      },
      {
        email: 'user1@example.com',
        password: 'user123',
        role: 'user'
      },
      {
        email: 'user2@example.com',
        password: 'user123',
        role: 'user'
      },
      {
        email: 'john@example.com',
        password: 'password123',
        role: 'user'
      },
      {
        email: 'jane@example.com',
        password: 'password123',
        role: 'user'
      }
    ];

    let createdCount = 0;
    let skippedCount = 0;

    for (const userData of users) {
      try {
        // Check if user already exists
        const existingUser = await User.findByEmail(userData.email);

        if (existingUser) {
          console.log(`  ⚠ User ${userData.email} already exists, skipping...`);
          skippedCount++;
          continue;
        }

        // Create new user (password is hashed by the model)
        await User.create(userData);
        console.log(`  ✓ Created user: ${userData.email} (${userData.role})`);
        createdCount++;
      } catch (error) {
        console.error(`  ✗ Failed to create user ${userData.email}:`, error.message);
      }
    }

    console.log(`\n  Summary: ${createdCount} created, ${skippedCount} skipped`);
  },

  async clear() {
    // Remove seeded users (keep admin if needed)
    const emailsToRemove = [
      'user1@example.com',
      'user2@example.com',
      'john@example.com',
      'jane@example.com'
    ];

    const { error, count } = await supabase
      .from('users')
      .delete({ count: 'exact' })
      .in('email', emailsToRemove);

    if (error) throw error;
    console.log(`  ✓ Removed ${count} test users`);

    // Optionally remove admin too (uncomment if needed)
    // await supabase.from('users').delete().eq('email', 'admin@pizza.com');
  }
};

require('dotenv').config();
const fs = require('fs');
const path = require('path');

// Verify Supabase credentials are configured before running seeders
require('../config/supabase');

// Get all seeder files
const getSeederFiles = () => {
  const seedersDir = path.join(__dirname);
  const files = fs.readdirSync(seedersDir)
    .filter(file => file.endsWith('.seeder.js') && file !== 'seeder-runner.js')
    .sort();
  return files;
};

// Execute a single seeder
const executeSeeder = async (file) => {
  const seederPath = path.join(__dirname, file);
  const seeder = require(seederPath);

  try {
    console.log(`Running seeder: ${file}`);
    await seeder.seed();
    console.log(`✓ Seeder ${file} completed successfully`);
  } catch (error) {
    console.error(`✗ Seeder ${file} failed:`, error.message);
    throw error;
  }
};

// Clear a single seeder
const clearSeeder = async (file) => {
  const seederPath = path.join(__dirname, file);
  const seeder = require(seederPath);

  try {
    console.log(`Clearing seeder: ${file}`);
    if (seeder.clear) {
      await seeder.clear();
    }
    console.log(`✓ Seeder ${file} cleared successfully`);
  } catch (error) {
    console.error(`✗ Clear ${file} failed:`, error.message);
    throw error;
  }
};

// Run all seeders (or one specific seeder).
// Seeders are idempotent: they skip records that already exist.
const runSeeders = async (specificSeeder = null) => {
  try {
    // Reverse alphabetical so users.seeder.js runs before orders.seeder.js
    // (orders reference users via foreign key)
    const files = specificSeeder
      ? [specificSeeder]
      : getSeederFiles().reverse();

    console.log(`Running ${files.length} seeder(s)`);

    for (const file of files) {
      await executeSeeder(file);
    }

    console.log('All seeders completed successfully');
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

// Clear all seeders - orders before users (foreign key order)
const clearAllSeeders = async () => {
  try {
    const files = getSeederFiles();

    console.log(`Clearing ${files.length} seeder(s)`);

    for (const file of files) {
      await clearSeeder(file);
    }

    console.log('All seeders cleared successfully');
  } catch (error) {
    console.error('Clear failed:', error);
    process.exit(1);
  }
};

// Main execution
const command = process.argv[2];
const specificSeeder = process.argv[3];

if (command === 'seed') {
  runSeeders(specificSeeder);
} else if (command === 'clear') {
  clearAllSeeders();
} else {
  console.log('Usage: node seeder-runner.js [seed|clear] [specific-seeder-file]');
  console.log('Examples:');
  console.log('  node seeder-runner.js seed                    # Run all seeders');
  console.log('  node seeder-runner.js seed users.seeder.js    # Run specific seeder');
  console.log('  node seeder-runner.js clear                   # Clear all seeders');
  process.exit(1);
}

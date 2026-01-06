require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('MongoDB Connected for seeding');
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

// Seeder tracking schema
const seederSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  executedAt: { type: Date, default: Date.now }
});

const Seeder = mongoose.models.Seeder || mongoose.model('Seeder', seederSchema);

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
    
    // Record seeder execution
    await Seeder.create({ name: file });
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
    
    // Remove seeder record
    await Seeder.deleteOne({ name: file });
    console.log(`✓ Seeder ${file} cleared successfully`);
  } catch (error) {
    console.error(`✗ Clear ${file} failed:`, error.message);
    throw error;
  }
};

// Run all seeders
const runSeeders = async (specificSeeder = null) => {
  await connectDB();
  
  try {
    const files = specificSeeder 
      ? [specificSeeder] 
      : getSeederFiles();
    
    const executedSeeders = await Seeder.find({});
    const executedNames = new Set(executedSeeders.map(s => s.name));
    
    const pendingSeeders = files.filter(file => !executedNames.has(file));
    
    if (pendingSeeders.length === 0) {
      console.log('No pending seeders');
      return;
    }
    
    console.log(`Found ${pendingSeeders.length} pending seeder(s)`);
    
    for (const file of pendingSeeders) {
      await executeSeeder(file);
    }
    
    console.log('All seeders completed successfully');
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
};

// Clear all seeders
const clearAllSeeders = async () => {
  await connectDB();
  
  try {
    const files = getSeederFiles();
    const executedSeeders = await Seeder.find({});
    const executedNames = new Set(executedSeeders.map(s => s.name));
    
    const seedersToClear = files.filter(file => executedNames.has(file));
    
    if (seedersToClear.length === 0) {
      console.log('No seeders to clear');
      return;
    }
    
    console.log(`Clearing ${seedersToClear.length} seeder(s)`);
    
    // Clear in reverse order
    for (const file of seedersToClear.reverse()) {
      await clearSeeder(file);
    }
    
    console.log('All seeders cleared successfully');
  } catch (error) {
    console.error('Clear failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
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


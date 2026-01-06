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
    console.log('MongoDB Connected for migrations');
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

// Migration tracking schema
const migrationSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  executedAt: { type: Date, default: Date.now }
});

const Migration = mongoose.models.Migration || mongoose.model('Migration', migrationSchema);

// Get all migration files
const getMigrationFiles = () => {
  const migrationsDir = path.join(__dirname);
  const files = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.migration.js') && file !== 'migration-runner.js')
    .sort();
  return files;
};

// Execute a single migration
const executeMigration = async (file) => {
  const migrationPath = path.join(__dirname, file);
  const migration = require(migrationPath);
  
  try {
    console.log(`Running migration: ${file}`);
    await migration.up();
    
    // Record migration
    await Migration.create({ name: file });
    console.log(`✓ Migration ${file} completed successfully`);
  } catch (error) {
    console.error(`✗ Migration ${file} failed:`, error.message);
    throw error;
  }
};

// Rollback a single migration
const rollbackMigration = async (file) => {
  const migrationPath = path.join(__dirname, file);
  const migration = require(migrationPath);
  
  try {
    console.log(`Rolling back migration: ${file}`);
    if (migration.down) {
      await migration.down();
    }
    
    // Remove migration record
    await Migration.deleteOne({ name: file });
    console.log(`✓ Migration ${file} rolled back successfully`);
  } catch (error) {
    console.error(`✗ Rollback ${file} failed:`, error.message);
    throw error;
  }
};

// Run all pending migrations
const runMigrations = async () => {
  await connectDB();
  
  try {
    const files = getMigrationFiles();
    const executedMigrations = await Migration.find({});
    const executedNames = new Set(executedMigrations.map(m => m.name));
    
    const pendingMigrations = files.filter(file => !executedNames.has(file));
    
    if (pendingMigrations.length === 0) {
      console.log('No pending migrations');
      return;
    }
    
    console.log(`Found ${pendingMigrations.length} pending migration(s)`);
    
    for (const file of pendingMigrations) {
      await executeMigration(file);
    }
    
    console.log('All migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
};

// Rollback last migration
const rollbackLast = async () => {
  await connectDB();
  
  try {
    const executedMigrations = await Migration.find({}).sort({ executedAt: -1 });
    
    if (executedMigrations.length === 0) {
      console.log('No migrations to rollback');
      return;
    }
    
    const lastMigration = executedMigrations[0];
    await rollbackMigration(lastMigration.name);
    console.log('Rollback completed successfully');
  } catch (error) {
    console.error('Rollback failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
};

// Main execution
const command = process.argv[2];

if (command === 'up') {
  runMigrations();
} else if (command === 'down') {
  rollbackLast();
} else {
  console.log('Usage: node migration-runner.js [up|down]');
  process.exit(1);
}


# Database Seeders

This directory contains seeder files for populating the database with initial data.

## Available Seeders

- **users.seeder.js** - Seeds admin and test user accounts
- **orders.seeder.js** - Seeds sample orders for testing

## Usage

### Run All Seeders

```bash
npm run seed
```

### Run Specific Seeder

```bash
npm run seed:users
npm run seed:orders
```

### Clear All Seeders

```bash
npm run seed:clear
```

### Manual Execution

```bash
# Run all seeders
node seeders/seeder-runner.js seed

# Run specific seeder
node seeders/seeder-runner.js seed users.seeder.js

# Clear all seeders
node seeders/seeder-runner.js clear
```

## Seeder Details

### Users Seeder

Creates the following users:
- **admin@pizza.com** (password: `admin123`) - Admin user
- **user1@example.com** (password: `user123`) - Regular user
- **user2@example.com** (password: `user123`) - Regular user
- **john@example.com** (password: `password123`) - Regular user
- **jane@example.com** (password: `password123`) - Regular user

**Note:** Passwords are automatically hashed by the User model's pre-save hook.

### Orders Seeder

Creates sample orders with various statuses:
- Paid orders
- Pending orders
- Shipped orders
- Different pizza combinations

**Note:** Orders seeder requires users to exist. Run users seeder first.

## Seeder Execution Tracking

Seeders track their execution in a `seeders` collection to prevent duplicate data. Each seeder can be run multiple times safely - it will skip existing data.

## Custom Seeders

To create a new seeder:

1. Create a new file: `your-seeder-name.seeder.js`
2. Export an object with `seed()` and optionally `clear()` methods:

```javascript
module.exports = {
  async seed() {
    // Your seeding logic here
  },
  
  async clear() {
    // Optional: Logic to remove seeded data
  }
};
```

3. The seeder will be automatically picked up by the runner.


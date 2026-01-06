# Database Migrations

This directory contains migration files for database schema changes and data transformations.

## Available Migrations

- **001-initial-schema.migration.js** - Creates indexes for users and orders collections

## Usage

### Run All Pending Migrations

```bash
npm run migrate
```

### Rollback Last Migration

```bash
npm run migrate:rollback
```

### Manual Execution

```bash
# Run all pending migrations
node migrations/migration-runner.js up

# Rollback last migration
node migrations/migration-runner.js down
```

## Migration Details

### Initial Schema Migration

Creates the following indexes:

**Users Collection:**
- `email` (unique)
- `role`
- `createdAt`

**Orders Collection:**
- `userId`
- `paymentStatus`
- `createdAt`
- `stripePaymentId`
- `stripeSessionId`

## Migration Execution Tracking

Migrations track their execution in a `migrations` collection to ensure they only run once. Each migration is executed in order based on filename.

## Creating New Migrations

To create a new migration:

1. Create a new file: `XXX-description.migration.js` (where XXX is a sequential number)
2. Export an object with `up()` and optionally `down()` methods:

```javascript
module.exports = {
  async up() {
    // Migration logic here
    // This runs when applying the migration
  },
  
  async down() {
    // Rollback logic here
    // This runs when rolling back the migration
  }
};
```

3. The migration will be automatically picked up by the runner.

## Best Practices

- Always test migrations on a development database first
- Include rollback logic in the `down()` method
- Use descriptive names for migration files
- Keep migrations small and focused on a single change
- Never modify existing migrations that have been run in production


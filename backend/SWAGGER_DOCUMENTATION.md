# Swagger API Documentation Guide

## Overview

This document provides complete details on how to use the Swagger API documentation for the New York Pizza Dashboard API.

## Table of Contents

1. [Access Swagger Documentation](#access-swagger-documentation)
2. [Starting the Server](#starting-the-server)
3. [Using Swagger UI](#using-swagger-ui)
4. [Authentication](#authentication)
5. [Testing API Endpoints](#testing-api-endpoints)
6. [API Endpoints Overview](#api-endpoints-overview)
7. [Common Workflows](#common-workflows)
8. [Troubleshooting](#troubleshooting)

---

## Access Swagger Documentation

Once your backend server is running, you can access the Swagger documentation at:

**URL:** `http://localhost:3008/api-docs`

You can also access the raw JSON specification at:

**JSON Spec:** `http://localhost:3008/api-docs.json`

---

## Starting the Server

### Prerequisites

1. Make sure MongoDB is running
2. Ensure all environment variables are configured in `.env` file
3. Install dependencies if not already done:

```bash
cd backend
npm install
```

### Start the Backend Server

```bash
cd backend
npm start
```

Or for development mode with auto-reload:

```bash
cd backend
npm run dev
```

You should see output like:

```
Server running in development mode on port 3008
MongoDB Connected: <your-mongodb-connection-string>
```

### Verify Server is Running

Open your browser and navigate to:

```
http://localhost:3008
```

You should see:

```json
{
  "message": "New York Pizza Dashboard API",
  "version": "1.0.0",
  "documentation": "/api-docs",
  "endpoints": {
    "auth": "/api/auth",
    "orders": "/api/orders",
    "payments": "/api/payments",
    "admin": "/api/admin"
  }
}
```

Now navigate to:

```
http://localhost:3008/api-docs
```

You should see the Swagger UI interface with all API endpoints documented.

---

## Using Swagger UI

### Interface Overview

The Swagger UI provides:

- **Organized Endpoints by Tags:**
  - Authentication
  - Orders
  - Payments
  - Admin

- **For Each Endpoint:**
  - HTTP Method (GET, POST, PUT, DELETE)
  - Endpoint Path
  - Description
  - Request Parameters
  - Request Body Schema
  - Response Examples
  - Response Status Codes

### Navigation

1. **Expand an Endpoint:** Click on any endpoint to see its details
2. **View Schemas:** Scroll down to see data models and schemas
3. **Try it Out:** Click "Try it out" button to test the endpoint directly

---

## Authentication

Most API endpoints require JWT authentication. Here's how to authenticate:

### Step 1: Create an Account or Login

1. Find the **POST /api/auth/signup** or **POST /api/auth/login** endpoint
2. Click "Try it out"
3. Fill in the required fields:

**For Signup:**
```json
{
  "email": "test@example.com",
  "password": "password123",
  "role": "user"
}
```

**For Login:**
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

4. Click "Execute"
5. Copy the `token` from the response

### Step 2: Authorize Swagger UI

1. Click the **"Authorize"** button at the top of the page (green lock icon)
2. In the "bearerAuth" field, paste your token
3. Click "Authorize"
4. Click "Close"

Now all subsequent requests will include your authentication token!

### Step 3: Test Protected Endpoints

Try accessing protected endpoints like:
- GET /api/orders
- POST /api/orders
- GET /api/admin/stats (requires admin role)

---

## Testing API Endpoints

### Example: Create an Order

1. **Authenticate first** (see Authentication section above)
2. Find **POST /api/orders** endpoint
3. Click "Try it out"
4. Fill in the request body:

```json
{
  "pizzas": [
    {
      "name": "Margherita",
      "quantity": 2,
      "price": 10
    },
    {
      "name": "Pepperoni",
      "quantity": 1,
      "price": 12
    }
  ],
  "totalAmount": 32.00
}
```

5. Click "Execute"
6. View the response below

### Example: Get All Orders

1. Find **GET /api/orders** endpoint
2. Click "Try it out"
3. Click "Execute"
4. View your orders in the response

### Example: Create Checkout Session

1. First, create an order and note its `_id`
2. Find **POST /api/payments/create-checkout-session** endpoint
3. Click "Try it out"
4. Enter the order ID:

```json
{
  "orderId": "507f1f77bcf86cd799439011"
}
```

5. Click "Execute"
6. You'll receive a `url` in the response - this is the Stripe checkout URL

---

## API Endpoints Overview

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /api/auth/signup | Register new user | No |
| POST | /api/auth/login | Login user | No |

### Order Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /api/orders | Create new order | Yes |
| GET | /api/orders | Get user's orders | Yes |
| GET | /api/orders/:id | Get specific order | Yes |

### Payment Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /api/payments/create-checkout-session | Create Stripe checkout | Yes |
| POST | /api/payments/webhook | Stripe webhook (internal) | No |

### Admin Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /api/admin/users | Get all users | Yes (Admin) |
| PUT | /api/admin/users/:id | Update user role | Yes (Admin) |
| DELETE | /api/admin/users/:id | Delete user | Yes (Admin) |
| GET | /api/admin/orders | Get all orders | Yes (Admin) |
| PUT | /api/admin/orders/:id | Update order status | Yes (Admin) |
| GET | /api/admin/payments | Get all payments | Yes (Admin) |
| GET | /api/admin/stats | Get dashboard stats | Yes (Admin) |

---

## Common Workflows

### Workflow 1: User Registration and Order Placement

1. **POST /api/auth/signup** - Create account
2. Copy token from response
3. Authorize Swagger with token
4. **POST /api/orders** - Create an order
5. **POST /api/payments/create-checkout-session** - Get payment URL
6. **GET /api/orders** - View all your orders

### Workflow 2: Admin Management

1. **POST /api/auth/login** - Login as admin
2. Copy token and authorize
3. **GET /api/admin/stats** - View dashboard statistics
4. **GET /api/admin/orders** - View all orders
5. **PUT /api/admin/orders/:id** - Update order status
6. **GET /api/admin/users** - View all users
7. **PUT /api/admin/users/:id** - Change user role

### Workflow 3: Order Tracking

1. **POST /api/auth/login** - Login
2. Authorize with token
3. **GET /api/orders** - Get all your orders
4. **GET /api/orders/:id** - Get specific order details

---

## Troubleshooting

### Issue: "Unauthorized" Error

**Solution:**
- Make sure you've logged in and copied the token
- Click "Authorize" and paste your token
- Token format should be just the token string (don't add "Bearer " prefix)
- Check if token has expired (default: 7 days)

### Issue: "403 Forbidden" for Admin Endpoints

**Solution:**
- Admin endpoints require admin role
- Create an admin user by adding `"role": "admin"` during signup
- Or use an existing admin account

### Issue: Swagger UI Not Loading

**Solution:**
- Verify backend server is running on port 3008
- Check console for errors
- Try accessing `http://localhost:3008` first
- Clear browser cache and reload

### Issue: "Invalid Token" Error

**Solution:**
- Token might be expired
- Login again to get a new token
- Make sure you're using the complete token string
- Check for extra spaces when copying

### Issue: Cannot Test Payment Endpoints

**Solution:**
- You need a valid Stripe account and API keys
- Ensure STRIPE_SECRET_KEY is set in .env file
- For testing, use Stripe test mode keys
- Create an order first before creating checkout session

---

## Best Practices

1. **Always Test in Order:**
   - Start with authentication
   - Then test user endpoints
   - Finally test admin endpoints

2. **Use Valid Data:**
   - Email format must be valid
   - Password must be at least 6 characters
   - Order amounts must be positive
   - Pizza quantities must be at least 1

3. **Keep Track of IDs:**
   - Save order IDs for payment creation
   - Save user IDs for admin operations
   - Use copy-paste for accuracy

4. **Monitor Rate Limits:**
   - Auth endpoints have rate limiting (10 requests per 15 minutes)
   - Wait if you hit the limit

5. **Check Response Status:**
   - 200/201 = Success
   - 400 = Bad Request (check your data)
   - 401 = Not Authenticated (login again)
   - 403 = Forbidden (need admin role)
   - 404 = Not Found (check ID)
   - 500 = Server Error (check logs)

---

## Additional Resources

- **Swagger Official Documentation:** https://swagger.io/docs/
- **OpenAPI Specification:** https://spec.openapis.org/oas/v3.0.0
- **JWT Authentication:** https://jwt.io/introduction
- **Stripe API Documentation:** https://stripe.com/docs/api

---

## Support

For issues or questions:
1. Check server logs in the terminal
2. Review this documentation
3. Check the API response for error messages
4. Verify your request data matches the schema

---

## Quick Reference Commands

```bash
# Start backend server
cd backend
npm start

# Start in development mode
npm run dev

# Access Swagger UI
http://localhost:3008/api-docs

# Get JSON specification
http://localhost:3008/api-docs.json

# Test if server is running
curl http://localhost:3008
```

---

**Last Updated:** 2026-01-06

**API Version:** 1.0.0

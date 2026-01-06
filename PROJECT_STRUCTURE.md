# Pizza Dashboard - Complete File Structure

This document lists all files created in this project.

## Root Files
- `.gitignore` - Git ignore patterns
- `README.md` - Complete setup and usage documentation
- `PROJECT_STRUCTURE.md` - This file

## Backend Files

### Configuration
- `backend/package.json` - Backend dependencies and scripts
- `backend/.env` - Environment variables (example values)
- `backend/.env.example` - Environment variables template
- `backend/server.js` - Main Express server setup

### Database
- `backend/config/db.js` - MongoDB connection with retry logic

### Models (Mongoose Schemas)
- `backend/models/User.js` - User schema with password hashing
- `backend/models/Order.js` - Order schema with payment tracking

### Middleware
- `backend/middleware/auth.js` - JWT authentication and admin role checking

### Routes (API Endpoints)
- `backend/routes/auth.js` - Signup and login endpoints with rate limiting
- `backend/routes/orders.js` - Create and fetch orders (user protected)
- `backend/routes/payments.js` - Stripe checkout and webhook handling
- `backend/routes/admin.js` - Admin-only endpoints (users, orders, payments, stats)

## Frontend Files

### Configuration
- `frontend/package.json` - Frontend dependencies and scripts
- `frontend/.env` - Environment variables (example values)
- `frontend/.env.example` - Environment variables template

### Public
- `frontend/public/index.html` - HTML template

### Source
- `frontend/src/index.js` - React entry point
- `frontend/src/App.js` - Main app component with routing
- `frontend/src/api.js` - Axios instance with interceptors
- `frontend/src/utils.js` - Helper functions (date formatting, currency, role checks)

### Contexts (State Management)
- `frontend/src/contexts/AuthContext.js` - Authentication state and functions
- `frontend/src/contexts/CartContext.js` - Shopping cart state and functions

### Shared Components
- `frontend/src/components/shared/ProtectedRoute.js` - Route guard for auth and admin routes

### User Components
- `frontend/src/components/user/Login.js` - Login form
- `frontend/src/components/user/Signup.js` - Signup form
- `frontend/src/components/user/Menu.js` - Pizza menu with add to cart
- `frontend/src/components/user/Cart.js` - Shopping cart with quantity controls
- `frontend/src/components/user/Checkout.js` - Stripe checkout integration
- `frontend/src/components/user/Success.js` - Payment success page
- `frontend/src/components/user/Cancel.js` - Payment cancel page
- `frontend/src/components/user/UserDashboard.js` - User order history

### Admin Components
- `frontend/src/components/admin/AdminDashboard.js` - Admin overview with stats
- `frontend/src/components/admin/UsersList.js` - User management table
- `frontend/src/components/admin/OrdersList.js` - Order management table
- `frontend/src/components/admin/PaymentsList.js` - Payment tracking table

## Total File Count

- **Backend:** 14 files
- **Frontend:** 21 files
- **Root:** 3 files
- **Total:** 38 files

## Quick Start Commands

### Backend (Terminal 1)
```bash
cd backend
npm install
# Configure .env file with MongoDB and Stripe credentials
npm start
```

### Frontend (Terminal 2)
```bash
cd frontend
npm install
# Configure .env file with API URL and Stripe public key
npm start
```

## Key Features Implemented

### Authentication
- JWT-based authentication
- Role-based access control (user/admin)
- Password hashing with bcryptjs
- Rate limiting on auth endpoints

### User Features
- Browse pizza menu
- Shopping cart with quantity management
- Order creation
- Stripe payment integration
- Order history tracking

### Admin Features
- Dashboard with statistics
- User management (view, edit role, delete)
- Order management (view all, update status)
- Payment tracking (view all Stripe transactions)

### Security
- JWT token verification
- Admin role checks
- Rate limiting
- Password hashing
- Input validation
- CORS configuration
- Webhook signature verification

## Notes

- All code uses async/await for promises
- Error handling implemented throughout
- Material-UI for consistent styling
- React Context API for state management
- Stripe test mode ready
- MongoDB Atlas compatible
- Production-ready with proper logging

# Pizza Dashboard - Full Stack Application

A complete pizza ordering system with payment tracking using Stripe. Users can sign up, browse pizzas, place orders, and make payments. Admins can manage users, orders, and view payment history through a comprehensive dashboard.

## Tech Stack

### Backend
- **Node.js** (v18+) with **Express.js** (v4+)
- **MongoDB Atlas** - Cloud database
- **Mongoose** (v7+) - ODM for MongoDB
- **JWT** (jsonwebtoken v9+) - Authentication
- **bcryptjs** (v2+) - Password hashing
- **Stripe** (v10+) - Payment processing
- **express-rate-limit** - Rate limiting for auth routes

### Frontend
- **React.js** (v18+)
- **React Router** (v6+) - Navigation
- **Axios** (v1+) - HTTP client
- **Material-UI** (v5+) - UI components
- **React Toastify** (v9+) - Notifications
- **Context API** - State management (Auth & Cart)

---

## Project Structure

```
pizza-dashboard/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── User.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── orders.js
│   │   ├── payments.js
│   │   └── admin.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── package.json
│   ├── .env
│   └── .env.example
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── user/
│   │   │   ├── admin/
│   │   │   └── shared/
│   │   ├── contexts/
│   │   ├── App.js
│   │   ├── index.js
│   │   ├── api.js
│   │   └── utils.js
│   ├── package.json
│   ├── .env
│   └── .env.example
├── .gitignore
└── README.md
```

---

## Setup Instructions

### Prerequisites

- Node.js v18 or higher
- npm or yarn
- MongoDB Atlas account
- Stripe account (test mode)

---

### 1. MongoDB Atlas Setup

1. **Create Account**
   - Go to [mongodb.com](https://www.mongodb.com/)
   - Sign up for a free account
   - Click "Build a Database"

2. **Create Cluster**
   - Choose "Free" tier (M0)
   - Select your preferred cloud provider and region
   - Click "Create Cluster"

3. **Configure Database Access**
   - Go to "Database Access" in left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create username and password (save these!)
   - Set role to "Atlas Admin"
   - Click "Add User"

4. **Configure Network Access**
   - Go to "Network Access" in left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - **Note:** For production, restrict to specific IPs
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" in left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
   - Replace `<username>` and `<password>` with your credentials
   - Add database name after `.net/`: `mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/pizzadb?retryWrites=true&w=majority&appName=Cluster0`

---

### 2. Stripe Setup

1. **Create Account**
   - Go to [stripe.com](https://stripe.com/)
   - Sign up for an account
   - Complete verification (can skip for testing)

2. **Get API Keys**
   - Go to [dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys)
   - Toggle "Test mode" ON (top right)
   - Copy your "Publishable key" (starts with `pk_test_`)
   - Copy your "Secret key" (starts with `sk_test_`)

3. **Set Up Webhook (Optional for local testing)**
   - Go to [dashboard.stripe.com/webhooks](https://dashboard.stripe.com/webhooks)
   - Click "Add endpoint"
   - Enter URL: `http://localhost:5000/api/payments/webhook`
   - Select event: `checkout.session.completed`
   - Click "Add endpoint"
   - Copy the "Signing secret" (starts with `whsec_`)
   - **Note:** For local testing, you can use Stripe CLI for webhooks

---

### 3. Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

   - Edit `.env` with your values:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb+srv://youruser:yourpass@cluster0.xxxxx.mongodb.net/pizzadb?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET=your_super_secret_jwt_key_change_this_12345
   JWT_EXPIRE=7d
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start the server**
   ```bash
   npm start
   ```

   Server should start on `http://localhost:5000`

---

### 4. Frontend Setup

1. **Open a new terminal and navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

   - Edit `.env` with your values:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_STRIPE_PUBLIC_KEY=pk_test_your_stripe_publishable_key
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

   Frontend should open at `http://localhost:3000`

---

## Creating an Admin User

Since there's no admin signup in the UI, you need to create an admin user manually:

### Method 1: Using the API directly

1. Start the backend server
2. Use a tool like Postman or curl:

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@pizza.com",
    "password": "admin123",
    "role": "admin"
  }'
```

### Method 2: Sign up as user, then update in MongoDB Atlas

1. Sign up normally through the UI
2. Go to MongoDB Atlas dashboard
3. Click "Browse Collections"
4. Find the `users` collection
5. Find your user document
6. Edit the document and change `role` from `"user"` to `"admin"`
7. Save changes

### Method 3: Create in MongoDB directly

1. Go to MongoDB Atlas dashboard
2. Click "Browse Collections"
3. Click "Insert Document" in the `users` collection
4. Use this template (replace email and generate password hash):

```json
{
  "email": "admin@pizza.com",
  "password": "$2a$10$hashedPasswordHere",
  "role": "admin",
  "createdAt": {"$date": "2024-01-01T00:00:00.000Z"}
}
```

**Note:** For testing, use Method 1 (API) as it's the easiest.

---

## Features

### User Features
- **Authentication**
  - Sign up with email/password
  - Login with JWT token
  - Role-based access control

- **Pizza Ordering**
  - Browse pizza menu
  - Add pizzas to cart with quantities
  - View and modify cart
  - Create orders

- **Payment**
  - Checkout with Stripe
  - Secure payment processing
  - Payment success/cancel pages

- **Order History**
  - View all past orders
  - See order status
  - Track payment status

### Admin Features
- **Dashboard**
  - View total users
  - View total orders
  - Track total revenue

- **User Management**
  - View all users
  - Change user roles (user/admin)
  - Delete users

- **Order Management**
  - View all orders with user info
  - Update order status
  - Track order details

- **Payment Management**
  - View all payments
  - See Stripe payment IDs
  - Monitor payment status

---

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Orders (Protected)
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get specific order

### Payments (Protected)
- `POST /api/payments/create-checkout-session` - Create Stripe checkout
- `POST /api/payments/webhook` - Stripe webhook (raw body)

### Admin (Protected - Admin only)
- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id` - Update user role
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/:id` - Update order status
- `GET /api/admin/payments` - Get all payments

---

## Testing

### Test Cards (Stripe)
Use these test card numbers in Stripe checkout:

- **Success:** 4242 4242 4242 4242
- **Decline:** 4000 0000 0000 0002
- **Requires authentication:** 4000 0025 0000 3155

Use any future expiry date, any 3-digit CVC, and any ZIP code.

### Testing Flow

1. **User Flow:**
   - Sign up as a user
   - Browse menu at `/menu`
   - Add pizzas to cart
   - View cart at `/cart`
   - Proceed to checkout
   - Complete payment with test card
   - View order history at `/dashboard`

2. **Admin Flow:**
   - Create admin user (see instructions above)
   - Login with admin credentials
   - View dashboard at `/admin/dashboard`
   - Manage users at `/admin/users`
   - View/update orders at `/admin/orders`
   - Monitor payments at `/admin/payments`

---

## Deployment

### Backend Deployment (Heroku example)

1. Create Heroku app
2. Set environment variables in Heroku dashboard
3. Deploy:
   ```bash
   git subtree push --prefix backend heroku main
   ```

### Frontend Deployment (Vercel example)

1. Install Vercel CLI: `npm i -g vercel`
2. Navigate to frontend directory
3. Run: `vercel`
4. Set environment variables in Vercel dashboard
5. Update `REACT_APP_API_URL` to your backend URL

### Production Stripe Webhook

1. Deploy backend first
2. Go to Stripe dashboard
3. Add webhook endpoint with your production URL:
   `https://your-backend-url.com/api/payments/webhook`
4. Select `checkout.session.completed` event
5. Copy webhook secret and add to backend env vars

---

## Security Notes

- Never commit `.env` files to version control
- Use strong JWT secrets in production
- Restrict MongoDB network access to specific IPs in production
- Use Stripe live keys only in production
- Enable HTTPS for production deployments
- Implement rate limiting on all endpoints in production
- Validate all user inputs on backend
- Use helmet.js for additional Express security

---

## Troubleshooting

### Backend won't start
- Check MongoDB connection string is correct
- Ensure MongoDB Atlas IP whitelist includes your IP
- Verify all environment variables are set
- Check if port 5000 is available

### Frontend can't connect to backend
- Verify backend is running on port 5000
- Check `REACT_APP_API_URL` in frontend `.env`
- Check CORS settings in backend

### Stripe payments not working
- Verify you're using test keys
- Check Stripe keys are correctly set
- Use test card numbers from Stripe docs
- Check webhook secret is correct

### MongoDB connection issues
- Verify username/password in connection string
- Check IP whitelist in MongoDB Atlas
- Ensure cluster is running
- Try connection from MongoDB Compass

---

## Support

For issues, please check:
1. All environment variables are correctly set
2. MongoDB Atlas is properly configured
3. Stripe keys are in test mode
4. Both servers are running

---

## License

MIT License - Feel free to use this project for learning and development.

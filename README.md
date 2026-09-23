# New York Pizza Dashboard - Full Stack Application

A professional, enterprise-level pizza ordering system with payment tracking using Stripe. Users can sign up, browse authentic New York-style pizzas, place orders, and make payments. Admins can manage users, orders, and view payment history through a comprehensive dashboard with modern, polished design.

## Tech Stack

### Backend
- **Node.js** (v18+) with **Express.js** (v4+)
- **Supabase** (PostgreSQL) - Database, run locally via Supabase CLI + Docker
- **@supabase/supabase-js** (v2.45) - Database client
- **JWT** (jsonwebtoken v9+) - Authentication
- **bcryptjs** (v2+) - Password hashing
- **Stripe** (v14+) - Payment processing
- **express-rate-limit** - Rate limiting for auth routes
- **swagger-jsdoc / swagger-ui-express** - API documentation at `/api-docs`

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
├── supabase/
│   ├── migrations/
│   │   └── 20260923000001_init_schema.sql   # users + orders tables
│   └── config.toml                          # local Supabase config
├── backend/
│   ├── config/
│   │   ├── supabase.js                      # Supabase client (service key)
│   │   └── swagger.js
│   ├── models/
│   │   ├── User.js                          # data access (Supabase queries)
│   │   └── Order.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── orders.js
│   │   ├── payments.js
│   │   └── admin.js
│   ├── middleware/
│   │   └── auth.js
│   ├── seeders/
│   │   ├── seeder-runner.js
│   │   ├── users.seeder.js
│   │   └── orders.seeder.js
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

- **Node.js** v18 or higher
- **Docker Desktop** - must be installed and running (Supabase local runs in containers)
- **Supabase CLI** - install with `npm install -g supabase` (or `scoop install supabase` on Windows)
- **Stripe account** (test mode)

---

### 1. Supabase Setup (Local Database)

The database runs **locally** on your machine via the Supabase CLI — no cloud account needed.

1. **Start Docker Desktop** and leave it running

2. **Start the local Supabase stack** (from the project root):
   ```bash
   supabase start
   ```
   First run downloads Docker images (~1-2 GB) and may take a few minutes.

3. **Copy the credentials** printed at the end:
   - `Project URL` (e.g. `http://127.0.0.1:54321`)
   - `Secret` key (`sb_secret_...`) — backend only, never expose to the frontend
   - (`Publishable` key is the frontend-safe key; this project doesn't use it)

   You can see them again anytime with:
   ```bash
   supabase status
   ```

4. **Apply the database schema** (creates `users` and `orders` tables from `supabase/migrations/`):
   ```bash
   supabase db reset
   ```

5. **Optional:** open **Supabase Studio** (database dashboard) at http://localhost:54323 to browse tables.

Useful commands:

```bash
supabase status     # show running services + credentials
supabase stop       # stop the stack (data is kept)
supabase db reset   # wipe DB and re-apply all migrations
```

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
   - For local testing, use the [Stripe CLI](https://docs.stripe.com/stripe-cli):
     ```bash
     stripe listen --forward-to http://localhost:3008/api/payments/webhook
     ```
   - Copy the "Signing secret" it prints (starts with `whsec_`)

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
   PORT=3008
   SUPABASE_URL=http://127.0.0.1:54321
   SUPABASE_SECRET_KEY=sb_secret_your_local_secret_key
   JWT_SECRET=your_super_secret_jwt_key_change_this_12345
   JWT_EXPIRE=7d
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   FRONTEND_URL=http://localhost:3000
   ```

   `SUPABASE_URL` and `SUPABASE_SECRET_KEY` come from `supabase status` (step 1).

4. **Seed the database** (creates admin + test users and sample orders):
   ```bash
   npm run seed
   ```

5. **Start the server**
   ```bash
   npm start
   # or with auto-restart on changes:
   npm run dev
   ```

   Server starts on `http://localhost:3008` — API docs at `http://localhost:3008/api-docs`

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
   REACT_APP_API_URL=http://localhost:3008/api
   REACT_APP_STRIPE_PUBLIC_KEY=pk_test_your_stripe_publishable_key
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

   Frontend opens at `http://localhost:3000`

---

## Seeded Accounts

Running `npm run seed` (backend) creates:

| Email | Password | Role |
|---|---|---|
| `admin@pizza.com` | `admin123` | admin |
| `user1@example.com` | `user123` | user |
| `user2@example.com` | `user123` | user |
| `john@example.com` | `password123` | user |
| `jane@example.com` | `password123` | user |

Plus 6 sample orders in various payment states.

Other seeder commands:

```bash
npm run seed:clear    # remove all seeded data
npm run seed:users    # seed only users
npm run seed:orders   # seed only orders
```

### Creating an Admin User Manually

Use the API (no admin signup exists in the UI):

```bash
curl -X POST http://localhost:3008/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@pizza.com",
    "password": "admin123",
    "role": "admin"
  }'
```

Or change a user's role directly in Supabase Studio (http://localhost:54323) → `users` table → edit the `role` column.

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

Interactive documentation (Swagger UI): `http://localhost:3008/api-docs`

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
   - Sign up as a user (or login as `user1@example.com` / `user123`)
   - Browse menu at `/menu`
   - Add pizzas to cart
   - View cart at `/cart`
   - Proceed to checkout
   - Complete payment with test card
   - View order history at `/dashboard`

2. **Admin Flow:**
   - Login as `admin@pizza.com` / `admin123`
   - View dashboard at `/admin/dashboard`
   - Manage users at `/admin/users`
   - View/update orders at `/admin/orders`
   - Monitor payments at `/admin/payments`

---

## Deployment

### Database (Supabase Cloud)

1. Create a project at [supabase.com](https://supabase.com/)
2. Link it: `supabase link --project-ref <your-project-ref>`
3. Push the schema: `supabase db push`
4. Update backend env vars to the cloud `SUPABASE_URL` and service key (Project Settings → API)

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
- The Supabase **secret key** bypasses Row Level Security — keep it server-side only; never use it in the frontend
- Both tables have RLS enabled with no public policies, so direct anon access to the database returns nothing
- Use strong JWT secrets in production
- Use Stripe live keys only in production
- Enable HTTPS for production deployments
- Implement rate limiting on all endpoints in production
- Validate all user inputs on backend
- Use helmet.js for additional Express security

---

## Troubleshooting

### Supabase won't start
- Make sure **Docker Desktop is running**
- Run `supabase status` to see which services are up
- Ports 54321-54324 must be free
- Try `supabase stop` then `supabase start` again

### Backend won't start
- Verify `SUPABASE_URL` and `SUPABASE_SECRET_KEY` in `backend/.env` (get them from `supabase status`)
- Ensure the local Supabase stack is running (`supabase start`)
- Check if port 3008 is available
- Error `Missing SUPABASE_URL or SUPABASE_SECRET_KEY` means the `.env` is incomplete

### "Too many requests" (429) on login/signup
- Auth routes are rate-limited to 10 requests per 15 minutes per IP
- Restarting the backend resets the counter

### Frontend can't connect to backend
- Verify backend is running on port 3008
- Check `REACT_APP_API_URL` in frontend `.env`
- Check CORS settings in backend (`FRONTEND_URL`)

### Stripe payments not working
- Verify you're using test keys
- Check Stripe keys are correctly set in `backend/.env`
- Use test card numbers from Stripe docs
- For webhooks locally, use `stripe listen --forward-to http://localhost:3008/api/payments/webhook`

---

## Support

For issues, please check:
1. Docker Desktop is running and `supabase status` shows services up
2. All environment variables are correctly set
3. Stripe keys are in test mode
4. Backend (port 3008) and frontend (port 3000) are both running

---

## License

MIT License - Feel free to use this project for learning and development.

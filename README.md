# VendorX - E-commerce Platform

## Setup Instructions

### Environment Variables

To run this application, you need to set up your Supabase environment variables. Create a `.env.local` file in the root directory with the following variables:

```
# Supabase Environment Variables
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# JWT Secret for Authentication
JWT_SECRET=your_jwt_secret_key_change_in_production
```

### Supabase Setup

1. Create a Supabase account at [https://supabase.com](https://supabase.com)
2. Create a new project
3. Get your API keys from the project settings
4. Run the SQL scripts in the `scripts` folder to set up your database schema:
   - First run `01-create-tables.sql` to create the necessary tables
   - Then run `02-seed-data.sql` to add sample data (optional)

### Running the Application

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Authentication

The application uses JWT tokens for authentication. Users can sign up as either sellers or buyers.

### Signup Process

1. Navigate to `/auth/signup`
2. Fill in the required information
3. Select your role (seller or buyer)
4. Submit the form

### Login Process

1. Navigate to `/auth/login`
2. Enter your email and password
3. Submit the form

## Features

- User authentication (signup, login, logout)
- Role-based access (seller and buyer)
- Product management for sellers
- Shopping cart for buyers
- Buy requests system
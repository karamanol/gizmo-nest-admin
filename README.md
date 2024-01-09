# GizmoNest Admin center

## Description

GizmoNest Admin is Next.js command center for managing the GizmoNest Shop. It facilitates the administration of products, categories, reviews, orders, and user roles.

## Features

1. **User Authentication**

   - Implemented NextAuth for secure and seamless user authentication.

2. **Product Management**

   - Easily manage and update product information.
   - Efficiently handle product images.

3. **Categories Management**

   - Streamlined categories management for better organization.

4. **Orders and Payments**

   - Track and manage product orders effectively.
   - Efficiently check and handle payment transactions.

5. **Statistics**

   - Comprehensive statistics on products and orders for informed decision-making.

6. **Reviews Management**

   - Easily manage customer reviews.

7. **External Data Parsing**

   - Integration with GSMArena.com for product information retrieval.

8. **Responsive Design**
   - User-friendly and responsive design.

## Installation

1. Clone the repository

2. Install the dependencies:

   ```
   npm install
   ```

3. Start the development server:

   ```
   npm run dev

   ```

## .env.local file must be created and contain following variables for running:

### For authentication:

- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- GITHUB_CLIENT_ID
- GITHUB_SECRET_ID
- NEXTAUTH_SECRET
- NEXTAUTH_URL

### Mongodb integration

- MONGODB_URI

### Uploading images to Supabase

- SUPABASE_PASS
- NEXT_PUBLIC_SUPABASE_PROJECT_URL
- NEXT_PUBLIC_SUPABASE_API_KEY

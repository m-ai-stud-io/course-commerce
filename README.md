# Course Commerce - MERN Stack Application

This project is a full-stack MERN (MongoDB, Express.js, React, Node.js) application designed for an online course selling platform. This README documents the features and architecture implemented up to Stage 7 of its development.

## Table of Contents
- [Project Overview](#project-overview)
- [Features Implemented (Up to Stage 7)](#features-implemented-up-to-stage-7)
  - [Stage 1: Basic Setup & Database Connection](#stage-1-basic-setup--database-connection)
  - [Stage 2: User Authentication](#stage-2-user-authentication)
  - [Stage 3: Course Management (Admin)](#stage-3-course-management-admin)
  - [Stage 4: Course Display & Detail](#stage-4-course-display--detail)
  - [Stage 5: Shopping Cart](#stage-5-shopping-cart)
  - [Stage 6: Checkout & Payment Integration](#stage-6-checkout--payment-integration)
  - [Stage 7: UI/UX Improvements](#stage-7-uiux-improvements)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Running the Application](#running-the-application)
- [Backend Details](#backend-details)
  - [API Endpoints](#api-endpoints)
  - [Models](#models)
  - [Middleware](#middleware)
- [Frontend Details](#frontend-details)
  - [Pages](#pages)
  - [Components](#components)
  - [Routing](#routing)
- [Testing API Endpoints](#testing-api-endpoints)

---

## Project Overview
"Course Commerce" is an online platform for selling courses. This application is built using the MERN stack, with a clear separation between the frontend (React) and backend (Node.js/Express).

## Features Implemented (Up to Stage 7)

### Stage 1: Basic Setup & Database Connection
-   **Project Structure:** Separate `/client` (React frontend) and `/server` (Node.js/Express backend) folders.
-   **Backend Setup:** Basic Express server listening on `http://localhost:5000`.
    -   Root route (`/`) returns "Hello from Backend".
    -   MongoDB Atlas integration using Mongoose.
    -   Environment variable management with `dotenv`.
    -   `/api/db-status` endpoint to check database connection status.
-   **Frontend Setup:** Basic React application displaying "Hello React" on the home page.
    -   Configured proxy to backend (`http://localhost:5000`).
    -   Displays database connection status fetched from the backend.

### Stage 2: User Authentication
-   **User Model:** MongoDB model for `User` with fields: `name`, `email`, `password`, `role` (default: `user`).
-   **Password Hashing:** `bcryptjs` for secure password storage.
-   **JWT for Authentication:** `jsonwebtoken` for generating and verifying tokens.
-   **Authentication Routes:**
    -   `POST /api/auth/register`: User registration.
    -   `POST /api/auth/login`: User login, returns JWT token.
-   **Frontend Authentication Pages:**
    -   `Login.jsx`: Form for user login, stores JWT in `localStorage`, redirects based on user role.
    -   `Register.jsx`: Form for user registration.
-   **Protected Routes:** `ProtectedRoute` component to restrict access to routes based on login status and user role (e.g., `/dashboard`, `/admin`).
-   **Dynamic Navbar:** Shows "Logout" if logged in, "Login/Register" if not. "Admin" link visible only to admin users.

### Stage 3: Course Management (Admin)
-   **Course Model:** MongoDB model for `Course` with fields: `title`, `description`, `price`, `image`, `videoUrl`.
-   **Course API Endpoints (Backend):**
    -   `POST /api/courses`: Create a new course (Admin only).
    -   `GET /api/courses`: Get all courses (Public).
    -   `GET /api/courses/:id`: Get course by ID (Public).
    -   `PUT /api/courses/:id`: Update course (Admin only).
    -   `DELETE /api/courses/:id`: Delete course (Admin only).
-   **Admin Role Enforcement:** Middleware (`auth.js`) verifies JWT and fetches user from DB to ensure `req.user.role` is accurate for protected routes.
-   **Frontend Admin Dashboard:**
    -   `AdminDashboard.jsx`: Displays a list of all courses, with options to add, edit, or delete.
    -   `CourseForm.jsx`: Reusable component for adding new courses or editing existing ones.
-   **Role-based Redirection:** After login, regular users are redirected to the home page (course list), while admin users are redirected to the Admin Dashboard.

### Stage 4: Course Display & Detail
-   **Course Listing:** `Courses.jsx` page displays all available courses using styled cards with title, price, and image.
-   **Course Details:** `CourseDetail.jsx` page shows full details of a selected course (title, description, price, image, video URL).
-   **Navigation:** "View Details" button on course cards links to `CourseDetail.jsx`.
-   **Protection:** Both `Courses.jsx` and `CourseDetail.jsx` are protected by `ProtectedRoute`, requiring users to be logged in to view them.

### Stage 5: Shopping Cart
-   **Cart Context:** Implemented `CartContext` using React Context API for global cart management.
-   **Cart Page:** `Cart.jsx` displays items in the cart, total price, and provides "Checkout" and "Remove" buttons.
-   **Add to Cart:** "Add to Cart" button on `CourseDetail.jsx` adds courses to the cart.
-   **Persistence:** Cart items are persisted in `localStorage`.

### Stage 6: Checkout & Payment Integration
-   **Stripe Integration:** Backend (`/server`) integrated with Stripe for payment processing.
    -   `POST /api/checkout` route accepts course IDs and total amount, processes payment with Stripe.
    -   New `Order` model (`server/models/Order.js`) to save order details (user ID, purchased courses, amount, payment status, payment intent ID).
-   **Frontend Checkout:** `Checkout.jsx` page allows users to review their cart and make payments using Stripe Elements.
-   **Post-Payment:** Displays success/error messages using `react-toastify` and clears the cart upon successful payment.

### Stage 7: UI/UX Improvements
-   **Modern UI:** Applied a modern, minimal glassmorphism style across the frontend.
    -   Soft background images for pages.
    -   Transparent cards with rounded corners and subtle shadows.
    -   Consistent button styles with hover effects.
    -   Consistent typography and spacing.
-   **Material UI:** Integrated Material UI components for enhanced styling and responsiveness (e.g., `AppBar`, `Toolbar`, `Button`, `TextField`, `Typography`, `Box`, `Container`, `Grid`, `Card`, `CardMedia`, `CardContent`).
-   **User Feedback:** Implemented `react-toastify` for user-friendly error and success messages.
-   **Responsiveness:** Ensured mobile-friendliness through Material UI's responsive features and custom CSS media queries.

## Architecture
The application follows a typical MERN stack architecture:
-   **Frontend:** React application in the `/client` directory.
-   **Backend:** Node.js with Express.js in the `/server` directory.
-   **Database:** MongoDB Atlas (NoSQL cloud database).
-   **Communication:** Frontend communicates with the backend via RESTful API calls.
-   **Concurrency:** `concurrently` is used to run both the React development server and the Node.js backend server simultaneously during development.

## Getting Started

### Prerequisites
-   Node.js (v18 or higher recommended)
-   npm (Node Package Manager)
-   MongoDB Atlas Account (or a local MongoDB instance)

### Installation
1.  **Clone the repository (if applicable) or navigate to your project root:**
    ```bash
    cd D:\google-gemini\course-commerce
    ```
2.  **Install backend dependencies:**
    ```bash
    cd server
    npm install
    ```
3.  **Install frontend dependencies:**
    ```bash
    cd ../client
    npm install
    ```
4.  **Return to the project root:**
    ```bash
    cd ..
    ```

### Configuration
1.  **Create a `.env` file in the `server` directory:**
    ```bash
    # In D:\google-gemini\course-commerce\server\.env
    MONGO_URI="YOUR_MONGODB_ATLAS_CONNECTION_STRING"
    PORT=5000
    JWT_SECRET="YOUR_LONG_RANDOM_SECRET_KEY"
    STRIPE_SECRET_KEY="YOUR_STRIPE_SECRET_KEY"
    ```
2.  **Create a `.env` file in the `client` directory:**
    ```bash
    # In D:\google-gemini\course-commerce\client\.env
    REACT_APP_STRIPE_PUBLISHABLE_KEY="YOUR_STRIPE_PUBLISHABLE_KEY"
    ```
    -   Replace `YOUR_MONGODB_ATLAS_CONNECTION_STRING` with your actual MongoDB Atlas connection string.
    -   Replace `YOUR_LONG_RANDOM_SECRET_KEY` with a strong, random string for JWT signing (e.g., generated by `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`).
    -   Replace `YOUR_STRIPE_SECRET_KEY` and `YOUR_STRIPE_PUBLISHABLE_KEY` with your actual Stripe test keys from your Stripe Dashboard.

### Running the Application
From the `server` directory, run the development script:
```bash
cd D:\google-gemini\course-commerce\server
npm run dev
```
This command uses `concurrently` to start:
-   The React development server (frontend) on `http://localhost:3000`.
-   The Node.js/Express backend server on `http://localhost:5000`.

## Backend Details

### API Endpoints
-   **Authentication:**
    -   `POST /api/auth/register`: Register a new user.
    -   `POST /api/auth/login`: Log in a user, returns JWT.
-   **Courses:**
    -   `POST /api/courses`: Create a new course (Admin only).
    -   `GET /api/courses`: Get all courses (Public).
    -   `GET /api/courses/:id`: Get course by ID (Public).
    -   `PUT /api/courses/:id`: Update course by ID (Admin only).
    -   `DELETE /api/courses/:id`: Delete course by ID (Admin only).
-   **Orders:**
    -   `GET /api/orders`: Get logged-in user's purchased orders.
-   **Checkout:**
    -   `POST /api/checkout`: Process payment and create order.
-   **Utility:**
    -   `GET /api/db-status`: Check MongoDB connection status.

### Models
-   `server/models/User.js`: Mongoose schema for user data.
-   `server/models/Course.js`: Mongoose schema for course data.
-   `server/models/Order.js`: Mongoose schema for order data.

### Middleware
-   `server/middleware/auth.js`: JWT verification middleware. Decodes the token, fetches the user from the database to get the latest user data (including role), and attaches the user object to `req.user`.

## Frontend Details

### Pages (`client/src/pages`)
-   `Login.jsx`: User login form.
-   `Register.jsx`: User registration form.
-   `Dashboard.jsx`: Displays user profile and purchased courses.
-   `AdminDashboard.jsx`: Admin-only page for managing courses (CRUD operations).
-   `Courses.jsx`: Displays all available courses.
-   `CourseDetail.jsx`: Displays full details of a selected course.
-   `Cart.jsx`: Displays items in the shopping cart.
-   `Checkout.jsx`: Handles the payment process.

### Components (`client/src/components`)
-   `MainLayout.jsx`: The main layout component, including the Material UI navbar and application routes.
-   `ProtectedRoute.jsx`: Protects routes based on login status and user role.
-   `CourseForm.jsx`: Reusable form for adding/editing courses.

### Routing
-   React Router DOM is used for client-side routing.
-   Routes are defined in `client/src/components/MainLayout.jsx`.
-   Role-based redirection is implemented in `Login.jsx` and `ProtectedRoute.jsx`.

## Testing API Endpoints
Refer to the `COURSE_API_TESTING.md` file in the project root for `curl` commands to test all backend API endpoints (authentication, course management, and checkout).

---
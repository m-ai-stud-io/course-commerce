## API Testing with cURL

First, ensure your application is running by executing `npm run dev` in the `server` directory.

---

### Authentication Endpoints

#### 1. Register a New User (POST /api/auth/register)

This command will send a `POST` request to the `/api/auth/register` endpoint to create a new user.

```bash
curl -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"password123\"}"
```

**Expected Response (Success):** If successful, you will receive a JSON object containing a JWT token:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNj..."
}
```

**Expected Response (User Exists):** If you try to register with the same email again, you will get an error:

```json
{
  "msg": "User already exists"
}
```

#### 2. Log In a User (POST /api/auth/login)

This command will send a `POST` request to the `/api/auth/login` endpoint to log in the user you just created.

```bash
curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\",\"password\":\"password123\"}"
```

**Expected Response (Success):** If the credentials are correct, you will receive a new JWT token:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNj..."
}
```

**Expected Response (Invalid Credentials):** If the credentials are incorrect, you will get an error:

```json
{
  "msg": "Invalid credentials"
}
```

---

## Course API Testing with cURL


**Important:**
*   For `POST`, `PUT`, and `DELETE` operations, you will need a **JWT token from an admin user**.
*   You'll need to **manually update a registered user's `role` field to `'admin'` in your MongoDB Atlas database** for testing these protected routes.
*   Replace `YOUR_ADMIN_JWT_TOKEN` with the actual token obtained after logging in as an admin.
*   Replace `COURSE_ID` with the actual ID of a course from your database.

First, ensure your application is running by executing `npm run dev` in the `server` directory.

---

### 1. Create a New Course (POST /api/courses) - Admin Only

This command creates a new course. Remember to replace `YOUR_ADMIN_JWT_TOKEN`.

```bash
curl -X POST http://localhost:5000/api/courses \
-H "Content-Type: application/json" \
-H "x-auth-token: YOUR_ADMIN_JWT_TOKEN" \
-d '{
  "title": "Introduction to React",
  "description": "Learn the basics of React.js development.",
  "price": 99.99,
  "image": "https://example.com/react.jpg",
  "videoUrl": "https://example.com/react-intro.mp4"
}'
```

**Expected Response (Success):** A JSON object representing the newly created course, including its `_id`.

```json
{
  "_id": "60c72b2f9b1e8c001c8e4d5a",
  "title": "Introduction to React",
  "description": "Learn the basics of React.js development.",
  "price": 99.99,
  "image": "https://example.com/react.jpg",
  "videoUrl": "https://example.com/react-intro.mp4",
  "createdAt": "2023-07-11T12:00:00.000Z",
  "__v": 0
}
```

**Expected Response (Unauthorized/No Token):**
```json
{"msg": "No token, authorization denied"}
```
or
```json
{"msg": "Token is not valid"}
```

---

### 2. Get All Courses (GET /api/courses) - Public

This command retrieves all courses.

```bash
curl -X GET http://localhost:5000/api/courses
```

**Expected Response (Success):** An array of course objects.

```json
[
  {
    "_id": "60c72b2f9b1e8c001c8e4d5a",
    "title": "Introduction to React",
    "description": "Learn the basics of React.js development.",
    "price": 99.99,
    "image": "https://example.com/react.jpg",
    "videoUrl": "https://example.com/react-intro.mp4",
    "createdAt": "2023-07-11T12:00:00.000Z",
    "__v": 0
  }
]
```

---

### 3. Get Course by ID (GET /api/courses/:id) - Public

Replace `COURSE_ID` with an actual course ID (e.g., from the create response).

```bash
curl -X GET http://localhost:5000/api/courses/COURSE_ID
```

**Expected Response (Success):** A single course object.

```json
{
  "_id": "COURSE_ID",
  "title": "Introduction to React",
  "description": "Learn the basics of React.js development.",
  "price": 99.99,
  "image": "https://example.com/react.jpg",
  "videoUrl": "https://example.com/react-intro.mp4",
  "createdAt": "2023-07-11T12:00:00.000Z",
  "__v": 0
}
```

**Expected Response (Not Found):**
```json
{"msg": "Course not found"}
```

---

### 4. Update a Course (PUT /api/courses/:id) - Admin Only

Replace `COURSE_ID` and `YOUR_ADMIN_JWT_TOKEN`. You can update one or more fields.

```bash
curl -X PUT http://localhost:5000/api/courses/COURSE_ID \
-H "Content-Type: application/json" \
-H "x-auth-token: YOUR_ADMIN_JWT_TOKEN" \
-d '{
  "price": 129.99,
  "description": "An updated description for the React course."
}'
```

**Expected Response (Success):** The updated course object.

```json
{
  "_id": "COURSE_ID",
  "title": "Introduction to React",
  "description": "An updated description for the React course.",
  "price": 129.99,
  "image": "https://example.com/react.jpg",
  "videoUrl": "https://example.com/react-intro.mp4",
  "createdAt": "2023-07-11T12:00:00.000Z",
  "__v": 0
}
```

---

### 5. Delete a Course (DELETE /api/courses/:id) - Admin Only

Replace `COURSE_ID` and `YOUR_ADMIN_JWT_TOKEN`.

```bash
curl -X DELETE http://localhost:5000/api/courses/COURSE_ID \
-H "x-auth-token: YOUR_ADMIN_JWT_TOKEN"
```

**Expected Response (Success):**
```json
{"msg": "Course removed"}
```

---
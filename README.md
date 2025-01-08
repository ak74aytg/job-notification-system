# API Authentication System

This project implements a simple Node.js-based API with authentication using JWT, bcrypt for password hashing, and MongoDB for data storage. The API supports user registration and login.

## Prerequisites

- Node.js installed on your machine
- MongoDB database instance (local or cloud, e.g., MongoDB Atlas)
- A `.env` file with the following configuration:
  ```env
  TOKEN_SECRET=your_secret_key
  MONGO_URI=your_mongo_connection_string
  ```

## Installation

1. Clone the repository.
   ```bash
   git clone https://github.com/ak74aytg/job-notification-system.git
   cd job-notification-system
   ```

2. Install dependencies.
   ```bash
   npm install
   ```

3. Start the server.
   ```bash
   npm start
   ```
   The server will run on `http://localhost:3000`.

## API Endpoints

### 1. `POST /auth/register`
#### Description:
Registers a new user.

#### Request Body:
```json
{
  "name": "John Doe",
  "id": "john123",
  "password": "password123"
}
```

#### Response:
```json
{
  "status": "registration successfull",
  "userData": {
    "_id": "unique_user_id",
    "name": "John Doe",
    "id": "john123",
    "password": "hashed_password"
  },
  "token": "jwt_token"
}
```

### 2. `POST /auth/login`
#### Description:
Logs in an existing user.

#### Request Body:
```json
{
  "id": "john123",
  "password": "password123"
}
```

#### Response (Success):
```json
{
  "status": "logged in successfully",
  "data": {
    "_id": "unique_user_id",
    "name": "John Doe",
    "id": "john123",
    "password": "hashed_password"
  },
  "token": "jwt_token"
}
```

#### Response (Error):
```json
{
  "error": "incorrect password!"
}

OR

{
  "error": "no user found!"
}
```

## Frontend Integration

### Example Usage with Fetch API

#### Registration:
```javascript
fetch('http://localhost:3000/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'John Doe',
    id: 'john123',
    password: 'password123'
  })
})
  .then(response => response.json())
  .then(data => console.log(data));
```

#### Login:
```javascript
fetch('http://localhost:3000/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    id: 'john123',
    password: 'password123'
  })
})
  .then(response => response.json())
  .then(data => console.log(data));
```

## Dependencies

- `express`: Web framework for Node.js
- `dotenv`: Loads environment variables from `.env`
- `bcryptjs`: Password hashing
- `jsonwebtoken`: Token generation and validation
- `mongoose`: MongoDB object modeling

## Future Improvements

- Add middleware for route protection using JWT.
- Implement token expiration handling.
- Add unit tests for the services and routes.
- Secure sensitive data using environment variables.

## License

This project is licensed under the MIT License.


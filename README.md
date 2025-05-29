# Portfolio Backend Server

A robust Node.js/Express.js backend server for managing portfolio data with MongoDB integration, built with TypeScript for type safety and better development experience.

## 🏗️ Architecture Overview

The application follows a clean, modular architecture with clear separation of concerns:

```
src/
├── config/         # Configuration files (database, server)
├── controllers/    # Request handlers
├── data/          # Initial data and constants
├── docs/          # API documentation (Swagger)
├── interfaces/    # TypeScript interfaces
├── middleware/    # Express middleware
├── models/        # MongoDB schemas
├── routes/        # API routes
├── utils/         # Utility functions
└── validation/    # Input validation schemas
```

## 🔄 Application Flow

### 1. Request Lifecycle

1. **Initial Request**

   - Request hits the Express server
   - Goes through security middleware (CORS, rate limiting, etc.)
   - Routes to appropriate endpoint

2. **Middleware Processing**

   - Request passes through:
     - CORS validation
     - JSON body parsing
     - Security headers (Helmet)
     - Rate limiting
     - MongoDB query sanitization
     - XSS protection
     - Parameter pollution prevention

3. **Route Handling**

   - Request is routed to specific controller
   - Input validation is performed
   - Business logic is executed
   - Response is sent back

4. **Error Handling**
   - Global error handler catches any errors
   - Appropriate error responses are sent
   - Errors are logged using Winston logger

### 2. Portfolio API Endpoints

#### GET /api/portfolio

- **Flow**:
  1. Request received at `portfolio.routes.ts`
  2. Routed to `getPortfolio` controller
  3. Controller queries MongoDB using Portfolio model
  4. Returns portfolio data or 404 if not found
  5. Response formatted and sent to client

#### PUT /api/portfolio

- **Flow**:
  1. Request received with updated portfolio data
  2. Data validated using `validatePortfolio` middleware
  3. Validation schema checks all required fields
  4. If valid, `updatePortfolio` controller updates MongoDB document
  5. Returns updated portfolio data

#### POST /api/portfolio

- **Flow**:
  1. Request received with new portfolio data
  2. Data validated using `validatePortfolio` middleware
  3. Checks if portfolio already exists
  4. If not, creates new portfolio document
  5. Returns created portfolio data

### 3. Data Validation

The application uses Joi for comprehensive data validation:

- Validates all portfolio fields (personal info, about, experience, etc.)
- Ensures required fields are present
- Validates data types and formats (email, URLs, etc.)
- Custom validation rules for specific fields

### 4. Security Features

1. **Rate Limiting**

   - Configurable window and max requests
   - Prevents brute force attacks

2. **Security Headers**

   - Helmet.js integration
   - XSS protection
   - Content Security Policy
   - Frame protection

3. **Data Sanitization**

   - MongoDB query sanitization
   - XSS clean
   - Parameter pollution prevention

4. **CORS**
   - Configurable origins
   - Credentials support

### 5. Error Handling

The application implements a comprehensive error handling system:

- Custom AppError class for operational errors
- Global error handler for consistent error responses
- Development vs Production error details
- Winston logger for error tracking

### 6. Database Interaction

MongoDB interaction is handled through:

1. Mongoose schemas for data modeling
2. Robust connection handling with:
   - Auto-reconnection
   - Connection pooling
   - Timeout configurations
   - Graceful shutdown

## 🛠️ Technical Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Validation**: Joi
- **Security**:
  - Helmet
  - Express Rate Limit
  - CORS
  - XSS-Clean
  - HPP
  - Express-Mongo-Sanitize
- **Logging**: Winston
- **API Documentation**: Swagger/OpenAPI

## 🚀 Environment Configuration

The application uses the following environment variables:

- `PORT`: Server port (default: 8080)
- `MONGODB_URI`: MongoDB connection string
- `NODE_ENV`: Environment (development/production)
- `RATE_LIMIT_WINDOW_MS`: Rate limiting window
- `RATE_LIMIT_MAX_REQUESTS`: Maximum requests per window

## 🌟 Best Practices Implemented

1. **Type Safety**

   - TypeScript implementation
   - Comprehensive interfaces
   - Strong type checking

2. **Code Organization**

   - Modular architecture
   - Clear separation of concerns
   - Consistent file naming

3. **Security**

   - Multiple security middleware
   - Environment variable validation
   - Secure headers

4. **Error Handling**

   - Centralized error handling
   - Custom error classes
   - Detailed error logging

5. **Performance**

   - Connection pooling
   - Rate limiting
   - Efficient data validation

6. **Maintainability**
   - Well-documented code
   - Consistent coding style
   - Clear project structure

## 📝 API Documentation

The API is documented using Swagger/OpenAPI specification. Documentation can be accessed at `/api-docs` when the server is running.

## 🏃‍♂️ Running the Application

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up environment variables:

   - Copy `.env.example` to `.env`
   - Configure required variables

3. Start the server:
   - Development: `npm run dev`
   - Production: `npm run build && npm start`

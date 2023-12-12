# FLight Booking Service

## Features

- MVC architecture
- Express.js for server setup and routing
- dotenv for environment variable management
- HTTP Status Codes for standard HTTP status constants
- Nodemon for automatic server restarts during development
- Winston for logging

## Folder Structure

```plaintext
.
├── controllers         # Controllers for handling business logic
├── models              # Models for defining data structures
├── routes              # Express.js route definitions
├── services            # Business logic and services
├── utils               # Utility functions and helpers
├── config              # Configuration files
├── index.js            # Main application file
├── .env.example        # Example environment variables file
├── .gitignore          # Git ignore file
└── README.md           # Project documentation

## Getting Started

1. Clone the repository:
    git clone https://github.com/your-username/your-nodejs-mvc-starter.git
    cd your-nodejs-mvc-starter
```

2. Install dependencies:
   npm install

3. Copy the .env.example file and rename it to .env. Update the variables with your configuration:
   cp .env.example .env

4. Start the development server:
   npm run dev

The server will run at http://localhost:3000 by default.

## Scripts

- **npm run start**: Start the server in production mode.
- **npm run dev**: Start the server in development mode with Nodemon for automatic restarts.

## Environment Variables

Make sure to set the following environment variables in your `.env` file:

- **PORT**: The port on which the server will run (default: 3000).

## Logging

This template uses Winston for logging. You can customize the logging configuration in the `config/logger-config.js` file.

## Contributing

Feel free to contribute by opening issues or pull requests. Feedback and suggestions are welcome!

# Express WooCommerce API

An Express.js-based REST API for managing products and authentication, integrated with WooCommerce. Includes Swagger UI for comprehensive API documentation.

---

## 🚀 Features

- 🔐 User authentication (register/login)
- 📦 Product management for logged-in users
- 🔄 WooCommerce API integration for syncing products
- 📘 Swagger UI documentation at `/api-docs`
- ✅ Request validation using Joi
- 🌐 MongoDB connection with Mongoose
- 📁 Clean, modular folder structure
- 🔄 Dev mode with `nodemon`

---

## 🧰 Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- Joi for validation
- Swagger for API documentation
- WooCommerce REST API
- dotenv for environment management

---

## 📁 Project Structure

```plaintext
express-woocommerce-api/
├── server.js                # App entry point
├── .env                     # Environment variables (not committed)
├── .gitignore
├── package.json
├── package-lock.json
├── src/
│   ├── config/              # DB config (MongoDB)
│   ├── constants/           # Status codes
│   ├── controllers/         # Auth & Product logic
│   ├── docs/                # Swagger configuration
│   ├── middlewares/         # Auth and validation middlewares
│   ├── models/              # Mongoose models (User, Product)
│   ├── routes/              # API routes
│   ├── services/            # WooCommerce service integration
│   └── validations/         # Joi schemas for input validation
```

# Clone the repo

git clone <your-repo-url>
cd express-woocommerce-api

# Install dependencies

npm install

# Create environment config

cp .env.example .env

# Edit the .env file to fill in:

# - PORT

# - MONGO_URI

# - WOO_BASE_URL

# - WOO_CONSUMER_KEY

# - WOO_CONSUMER_SECRET

# Start the server

npm start # For production

# OR start in dev mode (with nodemon)

npm run dev

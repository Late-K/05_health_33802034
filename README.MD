# Food Brain

Code for Dynamic Web Applications module.

A lightweight web application for tracking food intake and calories, built with Node.js, Express and MySQL. The app integrates with the FatSecret API for searching food nutritional information and supports user registration, authentication, personal food lists and daily logs.

## Features

- User registration and authentication
- Create, view and delete your own food items
- Log daily food intake automatically and view daily summaries
- Integrates with the FatSecret API to search public food information
- Admin-style audit logs for login attempts and user lists

## Technologies Used

- Node.js
- Express.js
- EJS templating
- MySQL (mysql2)
- HTML + CSS
- dotenv for environment variables

## Project Structure

- `index.js` - Application entry point, express setup and route registration
- `create_db.sql` - Schema for creating database, tables and app database user
- `insert_test_data.sql` - Test data to populate the database
- `routes/` - All route handlers (main, users, foods)
- `middleware/redirectlogin.js` - Middleware to protect routes behind login
- `utils/` - Helper functions and DB queries (`dbQueries.js`, `addfood.js`, `api.js`)
- `views/` - EJS templates for UI (includes partials)
- `public/` - Static assets (CSS)

## Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js & npm](https://nodejs.org/en)
- A modern web browser
- [MySql](https://dev.mysql.com/downloads/mysql/)

### Clone the repository

```bash
git clone https://github.com/Late-K/05_health_33802034.git
cd 05_health_33802034
```

## Setting up the database

In your MySql database:

```sql
source create_db.sql
source insert_test_data.sql
```

## Setting up environment variables

Create a .env file in your project root directiory to store private values:

```ini
HEALTH_HOST=localhost
HEALTH_USER=health_app
HEALTH_PASSWORD=qwertyuiop
HEALTH_DATABASE=health
PORT=8000
SESSION_SECRET='somerandomstuff'
HEALTH_BASE_PATH=http://localhost:8000
API_CLIENT_ID=your-fatsecret-client-id
API_CLIENT_SECRET=your-fatsecret-client-secret
```

## Setting up fatsecret API

First navigate to: https://platform.fatsecret.com

Here you can create a free account, and then navigate to API KEYS to generate your keys.

Finally, you have to whitlist your server IP address to allow communication.

## Starting the server up

First install dependencies, in terminal:

```bash
npm i
```

Then start up the server:

```bash
node index.js
```

This is accessable locally on http://localhost:8000/

## Shutting Down the Server

Press CTRL + C in the terminal to stop the server.

# Create database script for health

# Create the database
CREATE DATABASE IF NOT EXISTS health;
USE health;

# Create the tables

CREATE TABLE IF NOT EXISTS users (
    id              INT AUTO_INCREMENT,
    username        VARCHAR(50) NOT NULL UNIQUE,
    first_name      VARCHAR(100),
    last_name       VARCHAR(100),
    email           VARCHAR(255) NOT NULL,
    password_hash  VARCHAR(255) NOT NULL,   
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    current_streak INT DEFAULT 0,
    longest_streak INT DEFAULT 0,
    last_goal_date DATE,
    PRIMARY KEY(id));

CREATE TABLE IF NOT EXISTS foods (
    id     INT AUTO_INCREMENT,
    user_id INT NOT NULL,
    name   VARCHAR(255) NOT NULL,
    calories INT NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE);

CREATE TABLE IF NOT EXISTS food_log (
    id     INT AUTO_INCREMENT,
    user_id INT NOT NULL,
    food_id INT NOT NULL,
    quantity DECIMAL(5,2) NOT NULL DEFAULT 1,
    date_eaten DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (food_id) REFERENCES foods(id) ON DELETE CASCADE);

CREATE TABLE IF NOT EXISTS fave_foods (
  id INT AUTO_INCREMENT,
  user_id INT NOT NULL,
  food_id INT NOT NULL,
  PRIMARY KEY(id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (food_id) REFERENCES foods(id) ON DELETE CASCADE,
  UNIQUE (user_id, food_id)
);

CREATE TABLE IF NOT EXISTS auditlog (
    id          INT AUTO_INCREMENT,
    username VARCHAR(50),
    email    VARCHAR(255),
    status      VARCHAR(50),
    time        DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id));

CREATE TABLE IF NOT EXISTS daily_goals (
    user_id INT PRIMARY KEY,
    calorie_goal INT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

# Create the application user
CREATE USER IF NOT EXISTS 'health_app'@'localhost' IDENTIFIED BY 'qwertyuiop'; 
GRANT ALL PRIVILEGES ON health.* TO 'health_app'@'localhost';

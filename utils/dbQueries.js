// foods queries //

function getFoodByName(userId, name, calories, next) {
  db.query(
    `SELECT * FROM foods 
     WHERE user_id = ? 
       AND LOWER(name) = LOWER(?) 
       AND calories = ?
     LIMIT 1`,
    [userId, name, calories],
    function (err, rows) {
      if (err) return next(err);
      next(null, rows[0] || null);
    }
  );
}

function insertFood(userId, name, calories, next) {
  db.query(
    "INSERT INTO foods (user_id, name, calories) VALUES (?, ?, ?)",
    [userId, name, calories],
    function (err, result) {
      if (err) return next(err);
      next(null, result.insertId);
    }
  );
}

function searchFoods(userId, text, next) {
  const term = "%" + text + "%";
  db.query(
    `SELECT *
     FROM foods
     WHERE user_id = ?
       AND LOWER(name) LIKE LOWER(?)`,
    [userId, term],
    function (err, rows) {
      if (err) return next(err);
      next(null, rows);
    }
  );
}

function getAllFoodsForUser(userId, next) {
  db.query(
    `SELECT *
     FROM foods
     WHERE user_id = ?
     ORDER BY name ASC`,
    [userId],
    function (err, rows) {
      if (err) return next(err);
      next(null, rows);
    }
  );
}

function deleteFood(userId, foodId, next) {
  db.query(
    "DELETE FROM foods WHERE id = ? AND user_id = ?",
    [foodId, userId],
    function (err) {
      if (err) return next(err);
      next(null);
    }
  );
}

// food_log queries //

function getTodaysLogEntry(userId, foodId, next) {
  db.query(
    `SELECT id, quantity 
     FROM food_log 
     WHERE user_id = ? AND food_id = ? AND date_eaten = CURDATE()`,
    [userId, foodId],
    function (err, rows) {
      if (err) return next(err);
      next(null, rows[0] || null);
    }
  );
}

function updateQuantity(logId, qty, next) {
  db.query(
    "UPDATE food_log SET quantity = quantity + ? WHERE id = ?",
    [qty, logId],
    function (err) {
      if (err) return next(err);
      next(null);
    }
  );
}

function insertLog(userId, foodId, qty, next) {
  db.query(
    `INSERT INTO food_log (user_id, food_id, quantity, date_eaten)
     VALUES (?, ?, ?, CURDATE())`,
    [userId, foodId, qty],
    function (err) {
      if (err) return next(err);
      next(null);
    }
  );
}

function getDailySummaries(userId, next) {
  db.query(
    `
    SELECT 
      DATE_FORMAT(fl.date_eaten, '%Y-%m-%d') AS date_eaten,
      SUM(fl.quantity) AS total_items,
      SUM(fl.quantity * f.calories) AS total_calories
    FROM food_log fl
    JOIN foods f ON f.id = fl.food_id
    WHERE fl.user_id = ?
    GROUP BY fl.date_eaten
    ORDER BY fl.date_eaten DESC
    `,
    [userId],
    function (err, rows) {
      if (err) return next(err);
      next(null, rows);
    }
  );
}

function getDailyLog(userId, date, next) {
  db.query(
    `
    SELECT 
    food_log.id AS log_id,   
      foods.name,
      foods.calories,
      food_log.quantity,
      (foods.calories * food_log.quantity) AS total_calories
    FROM food_log
      JOIN foods ON foods.id = food_log.food_id
    WHERE 
      food_log.user_id = ?
      AND food_log.date_eaten = ?
    ORDER BY foods.name ASC
    `,
    [userId, date],
    function (err, rows) {
      if (err) return next(err);
      next(null, rows);
    }
  );
}

function deleteLogEntry(logId, userId, next) {
  db.query(
    "DELETE FROM food_log WHERE id = ? AND user_id = ?",
    [logId, userId],
    function (err) {
      if (err) return next(err);
      next(null);
    }
  );
}

// user queries //

function getUserByUsername(username, next) {
  db.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    function (err, rows) {
      if (err) return next(err);
      next(null, rows[0] || null);
    }
  );
}

function insertUser(username, first, last, email, passwordHash, next) {
  db.query(
    `INSERT INTO users (username, first_name, last_name, email, password_hash)
     VALUES (?, ?, ?, ?, ?)`,
    [username, first, last, email, passwordHash],
    function (err, result) {
      if (err) return next(err);
      next(null, result.insertId);
    }
  );
}

function getAllUsers(next) {
  db.query(
    "SELECT id, username, first_name, last_name, email FROM users",
    function (err, rows) {
      if (err) return next(err);
      next(null, rows);
    }
  );
}

// audit queries //

function insertAuditLog(username, status, next) {
  db.query(
    "INSERT INTO auditlog (username, status) VALUES (?, ?)",
    [username, status],
    function (err) {
      if (err) return next(err);
      next(null);
    }
  );
}

function getAuditLogs(next) {
  db.query("SELECT * FROM auditlog ORDER BY time DESC", function (err, rows) {
    if (err) return next(err);
    next(null, rows);
  });
}

module.exports = {
  getFoodByName,
  insertFood,
  searchFoods,
  getAllFoodsForUser,
  deleteFood,
  getTodaysLogEntry,
  updateQuantity,
  insertLog,
  getDailySummaries,
  getDailyLog,
  deleteLogEntry,
  getUserByUsername,
  insertUser,
  getAllUsers,
  insertAuditLog,
  getAuditLogs,
};

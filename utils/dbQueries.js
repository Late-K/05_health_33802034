// foods queries //

exports.getFoodByName = function (userId, name, calories, next) {
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
};

exports.insertFood = function (userId, name, calories, next) {
  db.query(
    "INSERT INTO foods (user_id, name, calories) VALUES (?, ?, ?)",
    [userId, name, calories],
    function (err, result) {
      if (err) return next(err);
      next(null, result.insertId);
    }
  );
};

exports.searchFoods = function (userId, text, next) {
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
};

exports.getAllFoodsForUser = function (userId, next) {
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
};

exports.deleteFood = function (userId, foodId, next) {
  db.query(
    "DELETE FROM foods WHERE id = ? AND user_id = ?",
    [foodId, userId],
    function (err) {
      if (err) return next(err);
      next(null);
    }
  );
};

// food_log queries //

exports.getTodaysLogEntry = function (userId, foodId, next) {
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
};

exports.updateQuantity = function (logId, qty, next) {
  db.query(
    "UPDATE food_log SET quantity = quantity + ? WHERE id = ?",
    [qty, logId],
    function (err) {
      if (err) return next(err);
      next(null);
    }
  );
};

exports.insertLog = function (userId, foodId, qty, next) {
  db.query(
    `INSERT INTO food_log (user_id, food_id, quantity, date_eaten)
     VALUES (?, ?, ?, CURDATE())`,
    [userId, foodId, qty],
    function (err) {
      if (err) return next(err);
      next(null);
    }
  );
};

exports.getDailySummaries = function (userId, next) {
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
};

exports.getDailyLog = function (userId, date, next) {
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
};

exports.deleteLogEntry = function (logId, userId, next) {
  db.query(
    "DELETE FROM food_log WHERE id = ? AND user_id = ?",
    [logId, userId],
    function (err) {
      if (err) return next(err);
      next(null);
    }
  );
};

// user queries //

exports.getUserByUsername = function (username, next) {
  db.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    function (err, rows) {
      if (err) return next(err);
      next(null, rows[0] || null);
    }
  );
};

exports.insertUser = function (
  username,
  first,
  last,
  email,
  passwordHash,
  next
) {
  db.query(
    `INSERT INTO users (username, first_name, last_name, email, password_hash)
     VALUES (?, ?, ?, ?, ?)`,
    [username, first, last, email, passwordHash],
    function (err, result) {
      if (err) return next(err);
      next(null, result.insertId);
    }
  );
};

exports.getAllUsers = function (next) {
  db.query(
    "SELECT id, username, first_name, last_name, email FROM users",
    function (err, rows) {
      if (err) return next(err);
      next(null, rows);
    }
  );
};

// audit queries //

exports.insertAuditLog = function (username, status, next) {
  db.query(
    "INSERT INTO auditlog (username, status) VALUES (?, ?)",
    [username, status],
    function (err) {
      if (err) return next(err);
      next(null);
    }
  );
};

exports.getAuditLogs = function (next) {
  db.query("SELECT * FROM auditlog ORDER BY time DESC", function (err, rows) {
    if (err) return next(err);
    next(null, rows);
  });
};

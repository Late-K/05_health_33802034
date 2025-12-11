const foods = require("./dbQueries");

function addfood(userId, name, calories, qty, next) {
  foods.getFoodByName(userId, name, calories, function (err, existingFood) {
    if (err) return next(err);

    if (existingFood) {
      const foodId = existingFood.id;

      foods.getTodaysLogEntry(userId, foodId, function (err, entry) {
        if (err) return next(err);

        if (entry) {
          const newQty = entry.quantity + qty;

          foods.updateQuantity(entry.id, qty, function (err) {
            if (err) return next(err);

            return next(null, { updated: true, newQuantity: newQty });
          });
        } else {
          foods.insertLog(userId, foodId, qty, function (err) {
            if (err) return next(err);

            return next(null, { updated: false, newQuantity: qty });
          });
        }
      });
    } else {
      foods.insertFood(userId, name, calories, function (err, newFoodId) {
        if (err) return next(err);

        foods.insertLog(userId, newFoodId, qty, function (err) {
          if (err) return next(err);

          return next(null, { updated: false, newQuantity: qty });
        });
      });
    }
  });
}

module.exports = { addfood };

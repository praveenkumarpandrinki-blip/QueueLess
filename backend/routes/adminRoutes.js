const express = require("express");
const db = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/appointments", authMiddleware, (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin access required"
    });
  }

  const sql = `
    SELECT
      appointments.id,
      users.name AS customer_name,
      users.email,
      services.name AS service_name,
      appointments.appointment_date,
      appointments.appointment_time,
      appointments.token_number,
      appointments.status
    FROM appointments
    JOIN users
      ON appointments.user_id = users.id
    JOIN services
      ON appointments.service_id = services.id
    ORDER BY appointments.appointment_date DESC,
             appointments.appointment_time DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Database error"
      });
    }

    res.json(results);
  });
});

module.exports = router;
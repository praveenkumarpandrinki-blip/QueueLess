const express = require("express");
const db = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT
      appointments.id,
      services.name AS service_name,
      appointments.appointment_date,
      appointments.appointment_time,
      appointments.token_number,
      appointments.status
    FROM appointments
    JOIN services
      ON appointments.service_id = services.id
    WHERE appointments.user_id = ?
    ORDER BY appointments.appointment_date DESC,
             appointments.appointment_time DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Database error"
      });
    }

    res.json(results);
  });
});
router.put("/:id/cancel", authMiddleware, (req, res) => {
  const appointmentId = req.params.id;
  const userId = req.user.id;

  const sql = `
    UPDATE appointments
    SET status = 'cancelled'
    WHERE id = ?
      AND user_id = ?
      AND status = 'booked'
  `;

  db.query(sql, [appointmentId, userId], (err, result) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Database error"
      });
    }

    if (result.affectedRows === 0) {
      return res.status(400).json({
        message: "Appointment cannot be cancelled"
      });
    }

    res.json({
      message: "Appointment cancelled successfully!"
    });
  });
});
module.exports = router;
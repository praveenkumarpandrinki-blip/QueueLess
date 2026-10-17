const express = require("express");
const db = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, (req, res) => {
  const { serviceId, date, time } = req.body;
  const userId = req.user.id;

  if (!serviceId || !date || !time) {
    return res.status(400).json({
      message: "Service, date and time are required"
    });
  }

  const tokenSql = `
    SELECT COALESCE(MAX(token_number), 0) + 1 AS nextToken
    FROM appointments
    WHERE appointment_date = ?
  `;

  db.query(tokenSql, [date], (err, tokenResult) => {
    if (err) {
      return res.status(500).json({
        message: "Could not generate token"
      });
    }

    const tokenNumber = tokenResult[0].nextToken;

    const insertSql = `
      INSERT INTO appointments
      (user_id, service_id, appointment_date, appointment_time, token_number)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
      insertSql,
      [userId, serviceId, date, time, tokenNumber],
      (err, result) => {
        if (err) {
          return res.status(500).json({
            message: "Could not book appointment"
          });
        }

        const appointmentId = result.insertId;

        const queueSql = `
          INSERT INTO queue
          (appointment_id, token_number, status)
          VALUES (?, ?, 'waiting')
        `;

        db.query(
          queueSql,
          [appointmentId, tokenNumber],
          (queueErr) => {
            if (queueErr) {
              console.error(queueErr);

              return res.status(500).json({
                message: "Appointment booked but queue creation failed"
              });
            }

            res.status(201).json({
              message: "Appointment booked successfully!",
              appointmentId,
              tokenNumber
            });
          }
        );
      }
    );
  });
});

module.exports = router;
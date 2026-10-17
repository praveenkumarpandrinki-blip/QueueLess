const express = require("express");
const db = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT
      appointments.id AS appointment_id,
      appointments.token_number,
      appointments.appointment_date,
      appointments.appointment_time,
      queue.status
    FROM appointments
    JOIN queue
      ON appointments.id = queue.appointment_id
    WHERE appointments.user_id = ?
      AND appointments.status = 'booked'
      AND queue.status = 'waiting'
    ORDER BY appointments.appointment_date ASC,
             appointments.appointment_time ASC
    LIMIT 1
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Database error"
      });
    }

    if (results.length === 0) {
      return res.json({
        message: "No active queue found"
      });
    }

    const appointment = results[0];

    const aheadSql = `
      SELECT COUNT(*) AS peopleAhead
      FROM queue q
      JOIN appointments a
        ON q.appointment_id = a.id
      WHERE a.appointment_date = ?
        AND q.token_number < ?
        AND q.status = 'waiting'
    `;

    db.query(
      aheadSql,
      [
        appointment.appointment_date,
        appointment.token_number
      ],
      (aheadErr, aheadResults) => {
        if (aheadErr) {
          console.error(aheadErr);

          return res.status(500).json({
            message: "Could not calculate queue position"
          });
        }

        const peopleAhead = aheadResults[0].peopleAhead;
        const estimatedWait = peopleAhead * 5;

        res.json({
          tokenNumber: appointment.token_number,
          peopleAhead,
          estimatedWait,
          status: appointment.status,
          appointmentDate: appointment.appointment_date,
          appointmentTime: appointment.appointment_time
        });
      }
    );
  });
});

module.exports = router;
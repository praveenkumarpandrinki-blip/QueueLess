const express = require("express");
const db = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// ================================
// BOOK APPOINTMENT + CREATE QUEUE
// ================================

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
      console.error(err);

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
      [
        userId,
        serviceId,
        date,
        time,
        tokenNumber
      ],
      (err, result) => {

        if (err) {
          console.error(err);

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
          [
            appointmentId,
            tokenNumber
          ],
          (queueErr) => {

            if (queueErr) {
              console.error(queueErr);

              return res.status(500).json({
                message:
                  "Appointment booked but queue creation failed"
              });
            }

            res.status(201).json({
              message:
                "Appointment booked successfully!",
              appointmentId,
              tokenNumber
            });

          }
        );
      }
    );
  });
});


// ================================
// GET CURRENT QUEUE STATUS
// ================================

router.get("/", authMiddleware, (req, res) => {

  const userId = req.user.id;

  const sql = `
    SELECT
      q.token_number AS tokenNumber,
      q.status AS status,
      a.appointment_date AS appointmentDate,
      a.appointment_time AS appointmentTime
    FROM queue q
    INNER JOIN appointments a
      ON q.appointment_id = a.id
    WHERE a.user_id = ?
      AND q.status = 'waiting'
    ORDER BY a.appointment_date ASC,
             a.appointment_time ASC
    LIMIT 1
  `;

  db.query(
    sql,
    [userId],
    (err, results) => {

      if (err) {
        console.error(err);

        return res.status(500).json({
          message:
            "Failed to fetch queue status"
        });
      }

      if (results.length === 0) {
        return res.json({
          message:
            "No active queue found."
        });
      }

      const currentQueue = results[0];

      // Find how many people are ahead
      const peopleAheadSql = `
        SELECT COUNT(*) AS peopleAhead
        FROM queue q
        INNER JOIN appointments a
          ON q.appointment_id = a.id
        WHERE q.status = 'waiting'
          AND a.appointment_date = ?
          AND q.token_number < ?
      `;

      db.query(
        peopleAheadSql,
        [
          currentQueue.appointmentDate,
          currentQueue.tokenNumber
        ],
        (err, aheadResult) => {

          if (err) {
            console.error(err);

            return res.status(500).json({
              message:
                "Failed to calculate queue position"
            });
          }

          const peopleAhead =
            aheadResult[0].peopleAhead;

          // Approximate 5 minutes per person
          const estimatedWait =
            peopleAhead * 5;

          res.json({
            tokenNumber:
              currentQueue.tokenNumber,

            peopleAhead,

            estimatedWait,

            status:
              currentQueue.status,

            appointmentDate:
              currentQueue.appointmentDate,

            appointmentTime:
              currentQueue.appointmentTime
          });

        }
      );
    }
  );
});


module.exports = router;
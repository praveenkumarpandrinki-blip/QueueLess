const express = require("express");
const db = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Submit admin access request
router.post("/", authMiddleware, (req, res) => {
  const {
    user_id,
    full_name,
    email,
    phone,
    occupation,
    organization_name,
    organization_type,
    reason,
    responsibilities
  } = req.body;

  const sql = `
    INSERT INTO admin_requests
    (user_id, full_name, email, phone, occupation,
     organization_name, organization_type, reason, responsibilities)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      user_id,
      full_name,
      email,
      phone,
      occupation,
      organization_name,
      organization_type,
      reason,
      responsibilities
    ],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          message: "Failed to submit admin access request"
        });
      }

      res.status(201).json({
        message: "Admin access request submitted successfully",
        requestId: result.insertId
      });
    }
  );
});

// Get all admin access requests
router.get("/", authMiddleware, (req, res) => {
  if (req.user.id !== 4) {
    return res.status(403).json({
      message: "Only the QueueLess owner can view admin requests."
    });
  }

  const sql = `
    SELECT *
    FROM admin_requests
    ORDER BY created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: "Failed to fetch admin requests"
      });
    }

    res.json(results);
  });
});

// Approve admin request
router.put("/:id/approve", authMiddleware, (req, res) => {
  if (req.user.id !== 4) {
    return res.status(403).json({
      message:
        "Only the QueueLess owner can approve or reject admin requests."
    });
  }

  const requestId = req.params.id;

  const getRequestSql = `
    SELECT user_id
    FROM admin_requests
    WHERE id = ?
  `;

  db.query(getRequestSql, [requestId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: "Failed to find request"
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "Request not found"
      });
    }

    const userId = results[0].user_id;

    const updateUserSql = `
      UPDATE users
      SET role = 'admin'
      WHERE id = ?
    `;

    db.query(updateUserSql, [userId], (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          message: "Failed to update user role"
        });
      }

      const updateRequestSql = `
        UPDATE admin_requests
        SET status = 'approved'
        WHERE id = ?
      `;

      db.query(updateRequestSql, [requestId], (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({
            message: "Failed to approve request"
          });
        }

        res.json({
          message: "Admin access approved successfully"
        });
      });
    });
  });
});

// Reject admin request
router.put("/:id/reject", authMiddleware, (req, res) => {
  if (req.user.id !== 4) {
    return res.status(403).json({
      message:
        "Only the QueueLess owner can approve or reject admin requests."
    });
  }

  const requestId = req.params.id;

  const sql = `
    UPDATE admin_requests
    SET status = 'rejected'
    WHERE id = ?
  `;

  db.query(sql, [requestId], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: "Failed to reject request"
      });
    }

    res.json({
      message: "Admin access request rejected"
    });
  });
});

module.exports = router;
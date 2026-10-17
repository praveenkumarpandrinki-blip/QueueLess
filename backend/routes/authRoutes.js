const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");
const db = require("../config/db");

const router = express.Router();


// ================================
// REGISTER
// ================================

router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `
      INSERT INTO users
      (name, email, phone, password)
      VALUES (?, ?, ?, ?)
    `;

    db.query(
      sql,
      [name, email, phone, hashedPassword],
      (err, result) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
              message: "Email already registered"
            });
          }

          return res.status(500).json({
            message: "Database error"
          });
        }

        res.status(201).json({
          message: "Registration successful!",
          userId: result.insertId
        });
      }
    );

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
});


// ================================
// LOGIN
// ================================

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const sql = "SELECT * FROM users WHERE email = ?";

    db.query(sql, [email], async (err, results) => {

      if (err) {
        return res.status(500).json({
          message: "Database error"
        });
      }

      if (results.length === 0) {
        return res.status(401).json({
          message: "Invalid email or password"
        });
      }

      const user = results[0];

      const passwordMatch = await bcrypt.compare(
        password,
        user.password
      );

      if (!passwordMatch) {
        return res.status(401).json({
          message: "Invalid email or password"
        });
      }

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d"
        }
      );

      res.json({
        message: "Login successful!",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role
        }
      });
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
});


// ================================
// CHECK LOGIN
// ================================

router.get("/me", authMiddleware, (req, res) => {
  res.json({
    message: "Token is valid",
    user: req.user
  });
});


// ================================
// UPDATE PROFILE
// ================================

router.put("/profile", authMiddleware, (req, res) => {

  const userId = req.user.id;

  const {
    name,
    email,
    phone
  } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({
      message: "Name, email and phone are required"
    });
  }

  const sql = `
    UPDATE users
    SET name = ?, email = ?, phone = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [name, email, phone, userId],
    (err) => {

      if (err) {

        if (err.code === "ER_DUP_ENTRY") {
          return res.status(409).json({
            message: "Email already registered"
          });
        }

        console.error(err);

        return res.status(500).json({
          message: "Failed to update profile"
        });
      }

      const getUserSql = `
        SELECT id, name, email, phone, role
        FROM users
        WHERE id = ?
      `;

      db.query(
        getUserSql,
        [userId],
        (err, results) => {

          if (err) {
            return res.status(500).json({
              message: "Profile updated but failed to fetch updated data"
            });
          }

          res.json({
            message: "Profile updated successfully",
            user: results[0]
          });

        }
      );

    }
  );
});


// ================================
// CHANGE PASSWORD
// ================================

router.put(
  "/change-password",
  authMiddleware,
  async (req, res) => {

    try {

      const userId = req.user.id;

      const {
        currentPassword,
        newPassword
      } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          message:
            "Current password and new password are required"
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          message:
            "New password must be at least 6 characters"
        });
      }

      const sql = `
        SELECT password
        FROM users
        WHERE id = ?
      `;

      db.query(
        sql,
        [userId],
        async (err, results) => {

          if (err) {
            return res.status(500).json({
              message: "Database error"
            });
          }

          if (results.length === 0) {
            return res.status(404).json({
              message: "User not found"
            });
          }

          const passwordMatch =
            await bcrypt.compare(
              currentPassword,
              results[0].password
            );

          if (!passwordMatch) {
            return res.status(401).json({
              message:
                "Current password is incorrect"
            });
          }

          const hashedPassword =
            await bcrypt.hash(
              newPassword,
              10
            );

          const updateSql = `
            UPDATE users
            SET password = ?
            WHERE id = ?
          `;

          db.query(
            updateSql,
            [hashedPassword, userId],
            (err) => {

              if (err) {
                return res.status(500).json({
                  message:
                    "Failed to change password"
                });
              }

              res.json({
                message:
                  "Password changed successfully"
              });

            }
          );

        }
      );

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message: "Server error"
      });

    }
  }
);


// ================================
// DELETE ACCOUNT
// ================================

router.delete(
  "/account",
  authMiddleware,
  (req, res) => {

    const userId = req.user.id;

    const sql = `
      DELETE FROM users
      WHERE id = ?
    `;

    db.query(
      sql,
      [userId],
      (err, result) => {

        if (err) {

          console.error(err);

          return res.status(500).json({
            message:
              "Failed to delete account"
          });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({
            message: "User not found"
          });
        }

        res.json({
          message:
            "Account deleted successfully"
        });

      }
    );
  }
);


module.exports = router;
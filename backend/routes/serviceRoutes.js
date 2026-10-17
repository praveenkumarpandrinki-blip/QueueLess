const express = require("express");
const db = require("../config/db");

const router = express.Router();

router.get("/", (req, res) => {
  const sql = "SELECT * FROM services ORDER BY id";

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Database error"
      });
    }

    res.json(results);
  });
});

module.exports = router;
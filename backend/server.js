const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./config/db");

const authRoutes = require("./routes/authRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const userAppointmentRoutes = require("./routes/userAppointmentRoutes");
const queueRoutes = require("./routes/queueRoutes");
const adminRoutes = require("./routes/adminRoutes");
const adminRequestRoutes = require("./routes/adminRequestRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/my-appointments", userAppointmentRoutes);
app.use("/api/queue", queueRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin-requests", adminRequestRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "QueueLess backend is running!"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`QueueLess server running on port ${PORT}`);
});
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const adminRoutes = require("./routes/admin.routes");
const bookingRoutes = require("./routes/booking.routes");
const setupBookingExpiryJob = require("./cron/bookingExpiry");

const app = express();

app.use((req, _res, next) => {
  console.log(req.method, req.url);
  next();
});


app.use(cors());
app.use(express.json());

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/bookings", bookingRoutes);

app.get("/", (_req, res) => {
  res.send("Ticket Booking Backend is running");
});

// Start cron job (optional)
setupBookingExpiryJob();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

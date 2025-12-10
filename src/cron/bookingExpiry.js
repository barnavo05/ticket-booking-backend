const cron = require("node-cron");
const pool = require("../db");

const setupBookingExpiryJob = () => {
  cron.schedule("*/1 * * * *", async () => {
    try {
      await pool.query(
        "UPDATE bookings SET status='FAILED' WHERE status='PENDING' AND created_at < NOW() - INTERVAL '2 minutes'"
      );
    } catch (err) {
      console.error("Error updating booking statuses", err);
    }
  });
};

module.exports = setupBookingExpiryJob;

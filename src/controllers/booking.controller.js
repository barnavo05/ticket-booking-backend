const { v4: uuidv4 } = require("uuid");
const pool = require("../db");

exports.createBooking = async (req, res) => {
  const client = await pool.connect();
  try {
    const { showId, seatCount } = req.body;

    if (!showId || !seatCount || seatCount <= 0) {
      return res.status(400).json({ message: "Invalid input" });
    }

    await client.query("BEGIN");

    // Lock the show row
    const showResult = await client.query(
      "SELECT available_seats FROM shows WHERE id=$1 FOR UPDATE",
      [showId]
    );

    if (showResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Show not found" });
    }

    const available = showResult.rows[0].available_seats;

    if (available < seatCount) {
      await client.query("ROLLBACK");
      return res
        .status(400)
        .json({ message: "Not enough seats available", status: "FAILED" });
    }

    const bookingId = uuidv4();

    await client.query(
      "UPDATE shows SET available_seats = available_seats - $1 WHERE id=$2",
      [seatCount, showId]
    );

    await client.query(
      "INSERT INTO bookings (id, show_id, seat_count, status) VALUES ($1, $2, $3, $4)",
      [bookingId, showId, seatCount, "CONFIRMED"]
    );

    await client.query("COMMIT");

    res.status(201).json({
      id: bookingId,
      showId,
      seatCount,
      status: "CONFIRMED",
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error in createBooking:", err);
    res.status(500).json({ message: "Server error" });
  } finally {
    client.release();
  }
};

exports.getBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT id, show_id, seat_count, status, created_at FROM bookings WHERE id=$1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error in getBookingStatus:", err);
    res.status(500).json({ message: "Server error" });
  }
};

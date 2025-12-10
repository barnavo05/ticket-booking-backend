const { v4: uuidv4 } = require("uuid");
const pool = require("../db");

exports.createShow = async (req, res) => {
  try {
    const { name, startTime, totalSeats } = req.body;

    if (!name || !startTime || !totalSeats) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const id = uuidv4();
    const query =
      "INSERT INTO shows (id, name, start_time, total_seats, available_seats) VALUES ($1, $2, $3, $4, $4)";
    await pool.query(query, [id, name, startTime, totalSeats]);

    res.status(201).json({ id, name, startTime, totalSeats });
  } catch (err) {
    console.error("Error in createShow:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getShows = async (_req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, start_time, total_seats, available_seats FROM shows ORDER BY start_time ASC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error in getShows:", err);
    res.status(500).json({ message: "Server error" });
  }
};

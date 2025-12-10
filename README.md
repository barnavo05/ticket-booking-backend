# Bus Ticket Booking Backend

Node.js + Express + PostgreSQL backend for a simple ticket booking system (similar to RedBus / BookMyShow).

## Tech Stack

- Node.js, Express
- PostgreSQL
- pg (Postgres client)
- uuid
- dotenv
- node-cron (for optional booking expiry)

## Features

- Admin can create shows/trips with:
  - name
  - start time
  - total seats
- Users can:
  - list available shows
  - book seats for a show
  - see booking status
- Concurrency-safe booking using:
  - PostgreSQL transactions
  - row-level locking with `SELECT ... FOR UPDATE`
- Optional cron job to mark old PENDING bookings as FAILED.

## Setup (Local)

1. Install dependencies:

   ```bash
   npm install

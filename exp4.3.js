const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// --- In-Memory Data Store ---
// 'available': The seat is free.
// 'locked': The seat is temporarily held by a user.
// 'booked': The seat has been permanently booked.
const seats = {
  'A1': { status: 'available', lockedBy: null, lockExpiresAt: null },
  'A2': { status: 'available', lockedBy: null, lockExpiresAt: null },
  'A3': { status: 'available', lockedBy: null, lockExpiresAt: null },
  'B1': { status: 'available', lockedBy: null, lockExpiresAt: null },
  'B2': { status: 'available', lockedBy: null, lockExpiresAt: null },
  'B3': { status: 'available', lockedBy: null, lockExpiresAt: null },
};

const LOCK_DURATION_MS = 60 * 1000; // 1 minute lock duration

// --- API Endpoints ---

// 1. GET /seats - View all available seats
app.get('/seats', (req, res) => {
  const availableSeats = Object.entries(seats)
    .filter(([seatId, seatData]) => seatData.status === 'available')
    .map(([seatId, seatData]) => ({ seatId, status: seatData.status }));
  
  res.json(availableSeats);
});

// 2. POST /lock-seat - Temporarily lock a seat
app.post('/lock-seat', (req, res) => {
  const { seatId, userId } = req.body;

  if (!seatId || !userId) {
    return res.status(400).json({ message: 'Seat ID and User ID are required.' });
  }

  const seat = seats[seatId];

  if (!seat) {
    return res.status(404).json({ message: 'Seat not found.' });
  }

  const now = new Date();
  
  // Check if the seat is available or if an existing lock has expired
  if (seat.status === 'available' || (seat.status === 'locked' && now > seat.lockExpiresAt)) {
    seat.status = 'locked';
    seat.lockedBy = userId;
    seat.lockExpiresAt = new Date(now.getTime() + LOCK_DURATION_MS);

    // Set a timer to automatically unlock the seat after the duration expires
    setTimeout(() => {
      // Only unlock if it's still locked by the same user (i.e., not confirmed)
      if (seats[seatId].status === 'locked' && seats[seatId].lockedBy === userId) {
        seats[seatId].status = 'available';
        seats[seatId].lockedBy = null;
        seats[seatId].lockExpiresAt = null;
        console.log(`Seat ${seatId} lock expired and has been released.`);
      }
    }, LOCK_DURATION_MS);

    res.json({ message: `Seat ${seatId} locked successfully. You have 1 minute to confirm.` });
  } else {
    // If the seat is locked or booked
    res.status(409).json({ message: `Seat ${seatId} is not available for locking.` });
  }
});

// 3. POST /confirm-seat - Confirm a seat booking
app.post('/confirm-seat', (req, res) => {
  const { seatId, userId } = req.body;

  if (!seatId || !userId) {
    return res.status(400).json({ message: 'Seat ID and User ID are required.' });
  }

  const seat = seats[seatId];

  if (!seat) {
    return res.status(404).json({ message: 'Seat not found.' });
  }

  const now = new Date();

  // Check if the seat is locked by the correct user and the lock has not expired
  if (seat.status === 'locked' && seat.lockedBy === userId && now <= seat.lockExpiresAt) {
    seat.status = 'booked';
    seat.lockedBy = null; // Clear lock info
    seat.lockExpiresAt = null;
    res.json({ message: `Booking for seat ${seatId} confirmed successfully!` });
  } else if (seat.status === 'locked' && seat.lockedBy !== userId) {
    res.status(403).json({ message: 'This seat is locked by another user.' });
  } else if (seat.status === 'locked' && now > seat.lockExpiresAt) {
    res.status(410).json({ message: 'Your lock on this seat has expired.' });
  } else {
    res.status(400).json({ message: 'Seat must be locked by you before confirming.' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Ticket booking server is running on http://localhost:${PORT}`);
});

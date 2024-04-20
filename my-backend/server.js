const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');


const app = express();
app.use(cors());
app.use(express.json());



//helper
function readDataFromFile(fileName) {
  try {
    const filePath = path.join(__dirname, fileName);
    const fileData = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileData);
  } catch (err) {
    console.error('Read error:', err);
    return [];
  }
}

function writeDataToFile(fileName, data) {
  try {
    const filePath = path.join(__dirname, fileName);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Write error:', err);
  }
}

// Check if a booking time overlaps with the requested time range
function isTimeOverlap(bookingStart, bookingEnd, queryStart, queryEnd) {
    return bookingStart < queryEnd && bookingEnd > queryStart;
}

// Update slot availability based on a given time range
function getAvailableSlots(bookedFrom, bookedTill) {
    const slots = readDataFromFile('parkingSlots.json').slots;
    const bookings = readDataFromFile('bookings.json');
    const requestedStartTime = new Date(bookedFrom);
    const requestedEndTime = new Date(bookedTill);

    // Assume all slots are available initially
    slots.forEach(slot => slot.isOccupied = false);

    // Determine slot availability
    bookings.forEach(booking => {
        const bookingStartTime = new Date(booking.bookedFrom);
        const bookingEndTime = new Date(booking.bookedTill);
        if (isTimeOverlap(bookingStartTime, bookingEndTime, requestedStartTime, requestedEndTime)) {
            const slot = slots.find(s => s.slotId === booking.slotId);
            if (slot) {
                slot.isOccupied = true;
            }
        }
    });

    return slots;
}

// Endpoint to fetch slots available within a specific time range
app.get('/api/parkingSlots', (req, res) => {
    const { bookedFrom, bookedTill } = req.query;
    if (!bookedFrom || !bookedTill) {
        return res.status(400).json({ error: "Please provide both 'bookedFrom' and 'bookedTill' query parameters." });
    }
    const availableSlots = getAvailableSlots(bookedFrom, bookedTill);
    res.json(availableSlots);
});

// Endpoint to create a new booking if the slot is available
app.post('/api/bookings', (req, res) => {
  const { userId, slotId, bookedFrom, bookedTill } = req.body;
  const slots = getAvailableSlots(bookedFrom, bookedTill);
  const slot = slots.find(s => s.slotId === slotId && !s.isOccupied);

  if (!slot) {
    return res.status(400).json({ error: 'Requested slot is not available for the selected time.' });
  }

  // Mark the slot as occupied for the new booking
  slot.isOccupied = true;
  const bookings = readDataFromFile('bookings.json');
  const newBooking = {
    userId, slotId, bookedFrom, bookedTill,
    bookingId: `booking${bookings.length + 1}`,
    paymentDetails: req.body.paymentDetails
  };

  bookings.push(newBooking);
  writeDataToFile('bookings.json', bookings);
  writeDataToFile('parkingSlots.json', { slots });

  res.status(201).json(newBooking);
});

// Endpoint to fetch booking history for a specific user
app.get('/api/userBookings', (req, res) => {
    const { email } = req.query;
    if (!email) {
        return res.status(400).json({ error: "Email parameter is required." });
    }

    const bookings = readDataFromFile('bookings.json');
    const userBookings = bookings.filter(booking => booking.userId === email);

    res.json(userBookings);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { readDataFromFile, writeDataToFile } = require('./fileHelpers');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Function to find and book the first available parking slot
function bookFirstAvailableSlot(req, res) {
  const slots = readDataFromFile('parkingSlots.json').slots;
  const availableSlot = slots.find(slot => !slot.isOccupied);

  if (!availableSlot) {
    return res.status(400).json({ error: 'No available slots.' });
  }

  // Mark the slot as occupied
  const updatedSlots = slots.map(slot =>
    slot.slotId === availableSlot.slotId ? { ...slot, isOccupied: true } : slot
  );

  writeDataToFile('parkingSlots.json', { slots: updatedSlots });

  const bookings = readDataFromFile('bookings.json');
  const newBooking = {
    ...req.body,
    slotId: availableSlot.slotId,
    bookingId: `booking${bookings.length + 1}`
  };

  bookings.push(newBooking);
  writeDataToFile('bookings.json', bookings);
  res.status(201).json(newBooking);
}

// Endpoints
app.get('/api/users', (req, res) => {
  const users = readDataFromFile('users.json');
  res.json(users);
});

app.post('/api/users', (req, res) => {
  const users = readDataFromFile('users.json');
  const newUser = { ...req.body, userId: `user${users.length + 1}` };
  users.push(newUser);
  writeDataToFile('users.json', users);
  res.status(201).send(newUser);
});

app.get('/api/bookings', (req, res) => {
  const bookings = readDataFromFile('bookings.json');
  res.json(bookings);
});

app.post('/api/bookings', bookFirstAvailableSlot);

app.get('/api/parkingSlots', (req, res) => {
  const slots = readDataFromFile('parkingSlots.json');
  res.json(slots);
});

app.post('/api/parkingSlots', (req, res) => {
  const slots = readDataFromFile('parkingSlots.json');
  const newSlot = { ...req.body, slotId: `slot${slots.length + 1}` };
  slots.push(newSlot);
  writeDataToFile('parkingSlots.json', slots);
  res.status(201).send(newSlot);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

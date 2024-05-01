const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection string
const uri =   process.env.MONGO;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Database and collections
let db, bookingsCollection, slotsCollection;

// Connect to DB
async function connectToDB() {
  await client.connect();
  db = client.db('parkingApp');
  bookingsCollection = db.collection('bookings');
  slotsCollection = db.collection('slots');
}

// Check if a booking time overlaps with the requested time range
function isTimeOverlap(bookingStart, bookingEnd, queryStart, queryEnd) {
    return bookingStart < queryEnd && bookingEnd > queryStart;
}

// Update slot availability based on a given time range
app.get('/api/parkingSlots', async (req, res) => {
  const { bookedFrom, bookedTill, type } = req.query; // Include type in your query
  if (!bookedFrom || !bookedTill || !type) {
      return res.status(400).json({ error: "Please provide 'bookedFrom', 'bookedTill', and 'type' parameters." });
  }
  const availableSlots = await getAvailableSlots(bookedFrom, bookedTill, type);
  res.json(availableSlots);
});

async function getAvailableSlots(bookedFrom, bookedTill, type) {
    const slots = await slotsCollection.find({ type }).toArray(); // Filter by type
    const bookings = await bookingsCollection.find().toArray();
    const requestedStartTime = new Date(bookedFrom);
    const requestedEndTime = new Date(bookedTill);

    slots.forEach(slot => slot.isOccupied = false);

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
function generateOTP(length = 4) {
    let otp = '';
    for(let i = 0; i < length; i++) {
        otp += Math.floor(Math.random() * 10).toString();
    }
    return otp;  
}


// Endpoint to create a new booking if the slot is available
app.post('/api/bookings', async (req, res) => {
  const { userId, vehicleType, amount, slotId, bookedFrom, bookedTill, paymentDetails ,vehicleNumber} = req.body;
  const slots = await getAvailableSlots(bookedFrom, bookedTill,vehicleType);
  const slot = slots.find(s => s.slotId === slotId && !s.isOccupied);
 

  if (!slot) {
    return res.status(400).json({ error: 'Requested slot is not available for the selected time.' });
  }

  // Mark the slot as occupied for the new booking
  slot.isOccupied = true;
  const newBooking = {
    userId, vehicleType, amount, slotId, bookedFrom, bookedTill,
    bookingId: `booking${new ObjectId()}`,
    paymentDetails,
    vehicleNumber,
    isCheckedIn: false,
    isCheckedOut: false
  };

  await bookingsCollection.insertOne(newBooking);
  await slotsCollection.updateOne({ slotId }, { $set: { isOccupied: true } });

  res.status(201).json(newBooking);
});

// Endpoint to fetch booking history for a specific user
app.get('/api/userBookings', async (req, res) => {
    const { email } = req.query;
    if (!email) {
        return res.status(400).json({ error: "Email parameter is required." });
    }

    const userBookings = await bookingsCollection.find({ userId: email }).toArray();
    res.json(userBookings);
});

// Endpoint to fetch all bookings of all users
app.get('/api/allBookings', async (req, res) => {
  const bookings = await bookingsCollection.find().toArray();
  res.json(bookings);
});
app.post('/api/check-in', async (req, res) => {
    const { bookingId, vehicleNumber } = req.body;

    try {
        const booking = await bookingsCollection.findOne({ _id: ObjectId(bookingId), vehicleNumber });
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found or vehicle number mismatch.' });
        }

//         // Verify if the previous booking has checked out
// const lastBooking = await bookingsCollection.find({ slotId: booking.slotId })
//     .sort({ bookedTill: -1 }) // Sort by 'bookedTill' in descending order
//     .limit(1) // Limit to get only the first document after sorting
//     .next(); // Get the first document from cursor

// if (lastBooking && !lastBooking.isCheckedOut) {
//     // Latest booking has not checked out yet
//     return res.status(403).json({ error: 'Previous booking has not checked out yet.' });
// }


        const otp = generateOTP();  // Assume generateOTP is already defined

        // Mark this booking as checked in
        await bookingsCollection.updateOne(
            { _id: ObjectId(bookingId) },
            { $set: { isCheckedIn: true } }
        );
        
        res.json({ message: 'Check-in successful', slotId: booking.slotId, otp });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error.' ,error});
    }
});

app.post('/api/check-out', async (req, res) => {
    const { bookingId, otp } = req.body;

    try {
        const booking = await bookingsCollection.findOne({ _id: ObjectId(bookingId), otp });
        if (!booking || !booking.isCheckedIn) {
            return res.status(404).json({ error: 'Invalid OTP or booking ID, or check-in not completed.' });
        }

        // Update the booking and slot status on checkout
        await bookingsCollection.updateOne(
            { _id: ObjectId(bookingId) },
            { $set: { isCheckedOut: true } }
        );
        await slotsCollection.updateOne(
            { _id: booking.slotId },
            { $set: { isOccupied: false, currentVehicle: null } }
        );
        res.json({ message: 'Check-out successful, slot now available.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error during check-out.' });
    }
});

// Add a Slot
app.post('/api/slots', async (req, res) => {
    const { slotId, type } = req.body;
    try {
        const newSlot = { slotId, type, isOccupied: false };
        await slotsCollection.insertOne(newSlot);
        res.status(201).json({ message: 'New slot added successfully.', newSlot });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add new slot.' });
    }
});

// Remove a Slot
app.delete('/api/slots/:slotId', async (req, res) => {
    const { slotId } = req.params;
    try {
        const result = await slotsCollection.deleteOne({ slotId });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Slot not found.' });
        }
        res.json({ message: 'Slot removed successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to remove slot.' });
    }
});
const PORT = process.env.PORT || 3001;
connectToDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}).catch(console.error);

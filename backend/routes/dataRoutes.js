//dataRoutes.js
const express = require('express');
const router = express.Router();
const Data = require('../models/Data');

// Function to evaluate pass/fail criteria
function evaluatePassFail(data) {
  const passesIdleCurrent24V = data.idle_current_24v >= 0 && data.idle_current_24v <= 12;
  const passesIdleCurrent3V = data.idle_current_3v >= 0 && data.idle_current_3v <= 4;
  const passesSolenoidCurrents = [data.solenoid1_current, data.solenoid2_current, data.solenoid3_current,
                                  data.solenoid4_current, data.solenoid5_current, data.solenoid6_current,
                                  data.solenoid7_current, data.solenoid8_current]
                                  .every(current => current >= 250 && current <= 550);
  return passesIdleCurrent24V && passesIdleCurrent3V && passesSolenoidCurrents;
}


// Get all data
router.get('/', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let query = {};

    if (startDate && endDate) {
      query.date_added = {
        $gte: new Date(startDate), 
        $lte: new Date(endDate)    
      };
    }

    // Sorting by 'date_added' field in ascending order
    const data = await Data.find(query).sort('date_added');
    res.json(data);
  } catch (err) {
    res.status(500).send('Error retrieving data: ' + err.message);
  }
});

// Route to update status of all data entries based on criteria
router.get('/update-status', async (req, res) => {
  try {
    const dataEntries = await Data.find({}); // Fetch all data entries
    const updates = dataEntries.map(async (data) => {
      const status = evaluatePassFail(data) ? 'Passed' : 'Failed'; // Determine status based on evaluation
      return Data.findByIdAndUpdate(data._id, { status: status }, { new: true }); // Update the status in the database
    });

    const updatedEntries = await Promise.all(updates); // Execute all update operations concurrently
    res.status(200).json({ message: 'Updated statuses successfully', data: updatedEntries });
  } catch (err) {
    console.error('Error updating data statuses:', err);
    res.status(500).send('Error updating data statuses');
  }
});



// Update existing data
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const updatedData = await Data.findByIdAndUpdate(id, req.body, { new: true }); // new: true to return the updated object
    if (!updatedData) {
      return res.status(404).json({ message: 'Data not found' });
    }
    res.json(updatedData);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Post new data
router.post('/', async (req, res) => {
  const newData = new Data(req.body);
  try {
    const savedData = await newData.save();
    res.status(201).json(savedData);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;

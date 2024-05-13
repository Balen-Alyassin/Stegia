//Data.js
const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  valve_module_part_number: { type: Number, required: true },
  valve_module_revision_number: { type: Number, required: true },
  pcb_article_number: { type: Number, required: true },
  pcb_revision: { type: String, required: true },
  pcb_manufacturing_year: { type: Number, required: true },
  pcb_manufacturing_week: { type: Number, required: true },
  pcb_serial: { type: String, required: true },
  idle_current_24v: { type: Number, required: true },
  idle_current_3v: { type: Number, required: true },
  solenoid1_current: { type: Number, required: true },
  solenoid2_current: { type: Number, required: true },
  solenoid3_current: { type: Number, required: true },
  solenoid4_current: { type: Number, required: true },
  solenoid5_current: { type: Number, required: true },
  solenoid6_current: { type: Number, required: true },
  solenoid7_current: { type: Number, required: true },
  solenoid8_current: { type: Number, required: true },
  test_person_id: { type: String, required: true },
  date_added: { type: Date, default: Date.now },
  time_added: { type: String, required: true },
  status: { type: String, default: 'In Progress', enum: ['Passed', 'Failed', 'In Progress'] }
});

const Data = mongoose.model('Data', dataSchema);

module.exports = Data;

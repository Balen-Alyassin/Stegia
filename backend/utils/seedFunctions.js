//seedFunctions.js
const Data = require('../models/Data');

exports.seedDB = async () => {
  try {
    const sampleData = new Data({
      valve_module_part_number: 133263,
      valve_module_revision_number: 73,
      pcb_article_number: 133512,
      pcb_revision: "A",
      pcb_manufacturing_year: 23,
      pcb_manufacturing_week: 5,
      pcb_serial: "8491",
      idle_current_24v: 11,
      idle_current_3v: 1,
      solenoid1_current: 0,
      solenoid2_current: 389,
      solenoid3_current: 432,
      solenoid4_current: 437,
      solenoid5_current: 0,
      solenoid6_current: 422,
      solenoid7_current: 496,
      solenoid8_current: 351,
      test_person_id: "Mathias",
      date_added: "2022-03-30",
      time_added: "03:56"
    });
    await sampleData.save();
  } catch (error) {
    console.error('Failed to seed database:', error);
  }
};


exports.clearDB = async () => {
  try {
    await Data.deleteMany({});
  } catch (error) {
    console.error('Failed to clear database:', error);
  }
};
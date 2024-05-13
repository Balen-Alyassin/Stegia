import { tokens } from "../theme";

export const generateDataReports = [
// Function to generate a random integer between min and max (inclusive)
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  
  // Function to generate a random serial number
  function generateSerial() {
    const serialNumber = getRandomInt(1000, 9999);
    return serialNumber.toString();
  }
];
  
  // Generate 100 data entries
  for (let i = 1; i <= 100; i++) {
    const articleNumber = 1121130;
    const revision = getRandomInt(1, 2).toString().padStart(2, '0');
    const year = getRandomInt(22, 24);
    const week = getRandomInt(1, 52);
    const serial = generateSerial();
    const idleCurrent24V = getRandomInt(3, 12);
    const idleCurrent33V = getRandomInt(1, 3);
    const solenoid1Current = getRandomInt(390, 445);
    const solenoid2Current = getRandomInt(390, 445);
    const solenoid3Current = getRandomInt(390, 445);
    const solenoid4Current = getRandomInt(390, 445);
    const solenoid5Current = getRandomInt(390, 445);
    const solenoid6Current = getRandomInt(390, 445);
    const solenoid7Current = getRandomInt(390, 445);
    const solenoid8Current = getRandomInt(390, 445);
    const testDate = getRandomInt(220101, 240101).toString();
    const testPersonID = ["Mats", "Ylva", "Mathias", "Michael"][getRandomInt(0, 3)];
  
    data.push({
      id: i,
      articleNumber,
      revision,
      year,
      week,
      serial,
      idleCurrent24V,
      idleCurrent33V,
      solenoid1Current,
      solenoid2Current,
      solenoid3Current,
      solenoid4Current,
      solenoid5Current,
      solenoid6Current,
      solenoid7Current,
      solenoid8Current,
      testDate,
      testPersonID
    });
  }
  
  // Output the generated data
  console.log(data);
  
const { mockData, loadDataFromJSON } = require('./mockdatajson.js');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx'); // 

// Specify the path to the monitored folder
const folderPath = 'C:/Users/Balen/WEB/Stegia-AB/Stegia/src/data/Input';

function convertCSVToJSON(csvFilePath) {
    // Use the xlsx library to read the CSV file
    const workbook = xlsx.readFile(csvFilePath);
    const sheetName = workbook.SheetNames[0]; 
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 }); 
    
    // Extract headers from the first row
    const headers = jsonData[0];
    const jsonArray = [];

    // Iterate over each row
    for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i];
        const obj = {};

        // Create a JSON object with keys
        headers.forEach((header, index) => {
            obj[header.trim()] = row[index] ? row[index].toString().trim() : null;
        });

        jsonArray.push(obj);
    }

    // Write the JSON array to the output file
    const jsonFilePath = csvFilePath.replace('.csv', '.json');
    fs.writeFileSync(jsonFilePath, JSON.stringify(jsonArray, null, 2));
    console.log(`CSV file converted to JSON: ${jsonFilePath}`);
}

function loadJSONData() {
    const files = fs.readdirSync(folderPath);
    files.forEach(file => {
        const filePath = path.join(folderPath, file);
        const ext = path.extname(file).toLowerCase();
        if (ext === '.json') {
            loadDataFromJSON(filePath);
        } else if (ext === '.csv') {
            convertCSVToJSON(filePath);
        } else if (ext === '.txt') {
            // convertTXTToJSON(filePath); // Implement this if needed
        } else if (ext === '.xlsx') {
            convertXLSToJSON(filePath);
        }
    });
}

function convertXLSToJSON(xlsFilePath) {
    const workbook = xlsx.readFile(xlsFilePath, { raw: true });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

    const headers = jsonData[0];
    const jsonArray = [];

    for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i];
        const obj = {};
        headers.forEach((header, index) => {
            obj[header.trim()] = row[index] ? row[index].toString().trim() : null;
        });
        jsonArray.push(obj);
    }

    const jsonFilePath = xlsFilePath.replace('.xlsx', '.json');
    fs.writeFileSync(jsonFilePath, JSON.stringify(jsonArray, null, 2));
    console.log(`File converted to JSON: ${jsonFilePath}`);
}

fs.watch(folderPath, (eventType, filename) => {
    if (eventType === 'rename' || eventType === 'change') {
        loadJSONData();
    }
});

loadJSONData();

console.log('Loaded data:', mockData);

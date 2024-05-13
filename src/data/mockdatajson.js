// mockdatajson.js

let mockData = []; // Initialize an empty array

// Export a function to load data from JSON files
function loadDataFromJSON(jsonPath) {
    try {
        const jsonData = require(jsonPath); // Load JSON data
        mockData = jsonData; // Update mockData array
    } catch (error) {
        console.error('Error loading data from JSON:', error);
    }
}

module.exports = {
    mockData,
    loadDataFromJSON
};

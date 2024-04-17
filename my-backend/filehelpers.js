const fs = require('fs');
const path = require('path');

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

module.exports = { readDataFromFile, writeDataToFile };

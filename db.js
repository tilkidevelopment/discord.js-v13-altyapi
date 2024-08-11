const fs = require('fs');
const path = './ekonomi.json';

const readData = () => {
  if (!fs.existsSync(path)) {
    fs.writeFileSync(path, JSON.stringify({}));
  }
  const rawData = fs.readFileSync(path);
  return JSON.parse(rawData);
};

const writeData = (data) => {
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
};

module.exports = { readData, writeData };

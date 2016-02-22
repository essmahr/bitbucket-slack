var fs = require('fs');

module.exports = {
  getFileJson: (file, callback) => {
    const fileData = fs.readFileSync(file, { encoding: 'utf8' });
    return JSON.parse(fileData);
  }
}

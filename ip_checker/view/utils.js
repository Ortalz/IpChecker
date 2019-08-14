let fs = require('fs');

/** Read Content Of IPs File */
async function parseIpList(callback) {
  let ipList = [];
  let replaceView = __dirname.lastIndexOf('view');
  let path = __dirname.substring(0, replaceView) + 'local-data/ip-list.text';
  fs.readFile(path, 'utf-8', function(err, data) {
    if (data) {
      ipList = data.split(',');
      callback(ipList);
    }
    if (err) {
      console.log(`Error opening IPs File: ${err}`);
    }
  });
}

module.exports = {
  parseIpList
};

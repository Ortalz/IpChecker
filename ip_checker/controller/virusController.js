let request = require('request');
let apiKeysObj = require('../config/index').getKeys();
let counter = 0;
let flag = 0;

function checkIP(ip, successCallback, failureCallback) {
  let apiKey = apiKeysObj[counter];
  try {
    request.get(`https://www.virustotal.com/vtapi/v2/ip-address/report?apikey=${apiKey}&ip=${ip}`, (error, response, body) => {
      if(error){
        console.log(`Error at virusController checkIP, Reason: ${error}`);
      }else{
        switch (response.statusCode) {
          case 200: {
            console.log('response status code = 200');
            flag = 0;
            successCallback(body);
            break;
          }
          case 204: {
            console.log('response status code = 204');
            if (counter < apiKeysObj.length-1) {
              counter++;
            } else {
              counter = 0;
            }
            if (flag >= apiKeysObj.length) {
              flag = 0;
              console.log('Throttled, Please Try again in 1 Minute');
              failureCallback({response_code: response.statusCode.toString(), verbose_msg: "Throttled, Please Try again in 1 Minute"});
              break;
            } else {
              flag++;
              checkIP(ip, successCallback, failureCallback);
              break;
            }
            break;
          }
          default: {
            counter = 0;
            flag = 0;
            console.log(`Other Response Code Recieved: ${response.statusCode}`);
            failureCallback({response_code: response.statusCode.toString(), verbose_msg: `Other Response Code Recieved: ${response.statusCode}`});
            break;
          }
        }
      }
      
    });
  } catch (err) {}
}

module.exports = {
  checkIP
};

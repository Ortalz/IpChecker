const config = require('./config.json');
const keys = require('./apiKeys.json');
const DB_NAME = "ipsdb";

function getDBURLConnectionString(){
  return `mongodb+srv://${config.user}:<${config.password}>@cluster0-plwiz.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;
}

function getLocalDBConnectionString(){
  return `mongodb://localhost:27017/${DB_NAME}`;
}

function getKeys(){
  return Object.values(keys);
}

function getDBName(){
  return `${DB_NAME}`;
}

module.exports = {
  getDBURLConnectionString, 
  getKeys,
  getLocalDBConnectionString,
  getDBName
};
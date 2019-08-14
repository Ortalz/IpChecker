const utils = require('../view/utils');
const MongoClient = require('mongodb').MongoClient;
const config = require('../config');
const virusController = require('./virusController');
const IpSchemaDAO = require('../repository/ipSchemaDAO');
const LogSchemaDAO = require('../repository/logSchemaDAO');
const IpModel = require('../model/ipModel');
const LogModel = require('../model/LogModel');

class appController {
  constructor() {
    this.ipSchemaDAO = new IpSchemaDAO();
    this.logSchemaDAO = new LogSchemaDAO();
  }

  setPaths(app) {
    /** Returns all IPs from file in an array */
    app.get('/iplist', (req, res) => {
      this.writeLogs(`Get all IPs from file in an array`, `app.get('/iplist')`, 'info');
      utils.parseIpList(data => {
        res.send(JSON.stringify(data));
      });
    });


    /** Check IP with external VirusFree API, and saves result to DB as well*/
    app.post('/checkip', (req, res) => {
      const ip = req.body.ip;
      this.writeLogs(`New check request to ip: ${ip}`, `app.post('/checkip')`, 'info');
      virusController.checkIP(
        ip,
        ipCheckResponse => {
          res.send(ipCheckResponse);
          const data = JSON.parse(ipCheckResponse);
          // If model is complexed, choose to use external function logic
          const country = data.country ? data.country : 'NA';
          const cleanUrls = data.undetected_urls ? data.undetected_urls.length : 0;
          const maliciousUrls = data.detected_urls ? data.detected_urls.length : 0;
          const dataToInsert = new IpModel(ip, country, cleanUrls, maliciousUrls);
          this.ipSchemaDAO.AddIp(dataToInsert);
        },
        ipCheckFailureResponse => {
          res.send(ipCheckFailureResponse);
        }
      );
      
    });

    /** Logging Middleware - need to be last */
    app.use( (err, req, res, next) => {
      if(err) {
        this.writeLogs(`Error occured: ${err}`, ``, 'error');
      }
      next();
    });

  }

  
  /** Init MongoDB Client */
  createConnectionToDb() {
    const uri = config.getLocalDBConnectionString();
    const client = new MongoClient(uri, { useNewUrlParser: true });

    client.connect((err, db) => {
      if (err) {
        this.writeLogs(`Can't connect to the DB: ${err}`, `createConnectionToDb`, 'error');
      }
      this.writeLogs(`Database created succesfully`, `createConnectionToDb`, 'error');
      db.close();
    });
  }

  writeLogs(data, functionName, level) {
    console.log(data);
    try{
      this.logSchemaDAO.AddLog(this.createNewLog(data, functionName, level));
    }catch(err){
      console.log(`Write new log to DB has failed because: ${err}`);
    }
  }

  createNewLog(data, functionName, level) {
    return new LogModel(data, functionName,level);
  }


}

module.exports = appController;

const MongoClient = require('mongodb').MongoClient;
const LogModel = require('../model/LogModel');
const config = require('../config');
const LogSchemaDAO = require('./logSchemaDAO');
const COLLECTION_NAME = 'Ips';
let instance = null;


class ipSchemaDAO {
  constructor() {
    if (!instance) {
      this.createIpCollection();
      this.logSchemaDAO = new LogSchemaDAO();
      instance = this;
    }
    return instance;
  }

  getdbName() {
    return config.getDBName();
  }

  getUrl() {
    return config.getLocalDBConnectionString();
  }

  getCollectionName() {
    return COLLECTION_NAME;
  }

  createIpCollection() {
    MongoClient.connect(this.getUrl(), (err, db) => {
      if (err) {
        console.log(`Error connecting to DB: ${err} at createIpCollection`);
      }else{
        const dbo = db.db(this.getdbName());
      dbo.collections((err, dbCollections) => {
        if (err) {
          this.writeLogs(`Error getting DB collection: ${err}`, 'createIpCollection', 'error');
        } else {
          if(this.checkIfCollectionNameIncluded(dbCollections, this.getCollectionName())){
            try {
              dbo.createCollection(this.getCollectionName(), (err, res) => {
                if (err) {
                  const logData = `Collection ${this.getCollectionName()} was not created because ${err}`;
                  this.writeLogs(logData, 'createIpCollection', 'error');
                } else {
                  const logData = `${res.collectionName} collection created!`;
                  this.writeLogs(logData, 'createIpCollection', 'info');
                  db.close();
                }
              });
            }catch{
              const logData = `Collection ${this.getCollectionName()} was not created because ${err}`;
              this.writeLogs(logData, 'createIpCollection', 'error');
            }
          }else{
            this.writeLogs(`${this.getCollectionName()} already exists, not creating again`, `createIpCollection`, `info`)
          }
        }
      });
      }      
    });
  }
  
  checkIfCollectionNameIncluded(CollectionArray, name){
    CollectionArray.forEach(collection => {
      if(collection.collectionName === name)
      return true;
    });
    return false;
  }


  AddIp(ipSchema) {
    MongoClient.connect(this.getUrl(), (err, db) => {
      if (err){
        console.log(`Error connecting to DB: ${err} at AddIp`);
      } else {
      const dbo = db.db(this.getdbName());
      try {
      dbo.collection(this.getCollectionName()).replaceOne(
        { address: `${ipSchema.address}` },
        ipSchema,
        {
          upsert: true
        },
        (err, res) => {
          if (err) {
            const logData = `Ip ${ipSchema.address} was not added because ${err}`;
            this.writeLogs(logData, 'AddIp', 'error');          
          }
          else{
            const logData = `Ip ${ipSchema.address} added successfuly`;
           this.writeLogs(logData, 'AddIp', 'info');
            db.close();
          }
        }); 
      }catch(err) {
        const logData = `Ip ${ipSchema.address} was not added because ${err}`;
        this.writeLogs(logData, 'AddIp', 'error');  
      }
      }
    });
  }

  deleteIp(address) {
    MongoClient.connect(this.getUrl(), (err, db) => {
      if (err){
        console.log(`Error connecting to DB: ${err} at deleteIp`);
      } else {
      // add error handing
      const dbo = db.db(this.getdbName());
        try {
          dbo.collection(this.getCollectionName()).deleteOne({ address: address} , (err, res) => {
            if (err) {
              const logData = `Ip ${address} was not deleted because ${err}`;
              this.writeLogs(logData, 'deleteIp', 'error');             
            }
            else{
              const logData = `Ip ${address} deleted successfuly`;
             this.writeLogs(logData, 'deleteIp', 'info');
              db.close();
            }         
          });
        }catch(err) {
          const logData = `Ip ${address} was not deleted because ${err}`;
          this.writeLogs(logData, 'deleteIp', 'error');
        }
      }
    });
  }

  getIpByAddress(address , callback) {
    MongoClient.connect(this.getUrl(), (err, db) => {
      if (err){
        console.log(`Error connecting to DB: ${err} at getIpByAddress`);
      } else {
      const dbo = db.db(this.getdbName());
        try {
          dbo.collection(this.getCollectionName()).findOne({ address: address} , (err, res) => {
            if (err) {
              const logData = `Get Ip ${address} failed because ${err}`;
              this.writeLogs(logData, 'getIpByAddress', 'error');
            }
            else{
              const logData = `Ip ${address} found`;
              this.writeLogs(logData, 'getIpByAddress', 'info');
              callback(res);             
              db.close();
            }         
          });
        }catch(err) {
          const logData = `Get Ip ${address} failed because ${err}`;
          this.writeLogs(logData, 'getIpByAddress', 'error');
        }
      }
    });
  }

  getAllIpSchemas(dataCallback, filter) {
    MongoClient.connect(this.getUrl(), (err, db) => {
      if (err){
        console.log(`Error connecting to DB: ${err} at getAllIpSchemas`);
      } else {
      const dbo = db.db(this.getdbName());
        try {
          let filterSchemas = filter? filter : {};
          dbo.collection(this.getCollectionName()).find(filterSchemas).toArray((err, res) => {
            if (err) {
              const logData = `Ip list was not returned because ${err}`;
              this.writeLogs(logData, 'getIpByAddress', 'error');
            }
            else{
              const logData = `All Ips returned`;
              this.writeLogs(logData, 'getIpByAddress', 'info');
              dataCallback(res);
              db.close();
            }         
          });
        }catch(err) {
          const logData = `Ip list was not returned because ${err}`;
          this.writeLogs(logData, 'getIpByAddress', 'error');
        }
      }
    });
  }

  getAllMaliciousIps(dataCallback) {
    let filterMalicious = {isMalicious : true};
    getAllIpSchemas(dataCallback, filterMalicious);
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

module.exports = ipSchemaDAO;

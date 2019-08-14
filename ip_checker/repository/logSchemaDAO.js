let  MongoClient = require('mongodb').MongoClient;
let config = require('../config');
const COLLECTION_NAME = 'Logs';
let instance = null;

class logSchemaDAO {
  constructor(){
    if (!instance) {
    this.createLogCollection();
    instance = this;
    }
    return instance;
  }

  getInstance() {
    // make singleton
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

  createLogCollection() {
    MongoClient.connect(this.getUrl(), (err, db) => {
      if (err){
        console.log(`Error connecting to DB: ${err} at createLogCollection`);
      } else {
      const dbo = db.db(this.getdbName());
      dbo.collections((err, dbCollections) => {
        if (err){
          this.writeLogs(`Error getting DB collection: ${err}`, 'createLogCollection', 'error');
        } else {
          if(this.checkIfCollectionNameIncluded(dbCollections, this.getCollectionName())){
            dbo.createCollection(this.getCollectionName(), { capped : true, size : 5242880, max : 5000 }, (err, res) => {
              if (err) {
                console.log(`Error connecting to DB: ${err} at createLogCollection`);
              } else {
                console.log(`${res.collectionName} collection created!`);
                db.close();
              }
            });
          }else{
            console.log(`${this.getCollectionName()} already exists, not creating again`);
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

  AddLog(data){
    MongoClient.connect(this.getUrl(), (err, db) => {
      if (err){
        console.log(`Error connecting to DB: ${err} at AddLog`);
      } else {
      const dbo = db.db(this.getdbName());
      dbo.collection(this.getCollectionName()).insertOne(data, (err, res) => {
          if (err) {
            console.log(`Log ${data} was not added because ${err}`);
          }
          else{
            console.log(`New log added successfuly:  ${JSON.stringify(data)}`);
            db.close();
          }
        }
      );
    }
    });
  }

  getAllErrorLogs(dataCallback) {
    let filterMalicious = {isMalicious : true};
    getAllIpSchemas(dataCallback, filterMalicious);
  }

  getAllLogs(dataCallback, filter) {
    MongoClient.connect(this.getUrl(), (err, db) => {
      if (err){
        console.log(`Error connecting to DB: ${err} at AddLog`);
      } else {
      const dbo = db.db(this.getdbName());
        try {
          let filterSchemas = filter? filter : {};
          dbo.collection(this.getCollectionName()).find(filterSchemas).toArray((err, res) => {
            if (err) {
              console.log(`Log list was not returned because ${err}`);
            }
            else{
              console.log(`All wanted logs returned`);
              dataCallback(res);
              db.close();
            }         
          });
        }catch(err) {
          console.log(`Log list was not returned because ${err}`);
        }
      }
    });
  }

}

module.exports = logSchemaDAO;
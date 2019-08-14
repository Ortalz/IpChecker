
class LogModel {

  constructor(data ,functionName, level) {
      this.timeStamp = new Date();
      this.data = data;
      this.functionName = functionName;
      this.level = level; // info/error;
  }
}


module.exports = LogModel;
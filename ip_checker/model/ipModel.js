class IpModel {

  constructor(address, country, totalClean, totalMalicious) {
    this.address = address;
    this.beenTested = true;
    this.totalCleanUrls = totalClean;
    this.totalMalicious = totalMalicious;
    this.isVirusFree = totalMalicious === 0 ? true : false;
    this.isMalicious = totalMalicious > 0 ? true : false;
    this.country = country;
  }
}

module.exports = IpModel;

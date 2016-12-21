/**
 * Created by weijianli on 16/12/2.
 */
const config = require('../config/config');
function *filter(next) {
  if(!config.validDomain[this.hostname]){
    this.status = 400;
    this.body = `domain ${this.hostname} does not be allowed`;
  }else {
    yield next;
  }

}

module.exports = filter;
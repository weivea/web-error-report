/**
 * Created by weijianli on 16/11/30.
 */
const fs = require('fs');
const router = require('koa-router')();
const reportDomainFilter = require('../modules/reportDomainFilter')
const loger = require("../modules/log4js").log;
const reportBuffer = require("../modules/reportBuffer")

router.get('/', reportDomainFilter, function * (next) {
  //loger.debug("report data:"+JSON.stringify(this.query));
  reportBuffer.inWrite(this.query);
  this.body = fs.createReadStream('./public/err_report.gif');
});

module.exports = router
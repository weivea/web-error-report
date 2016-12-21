/**
 * Created by weijianli on 16/11/30.
 */
"use strict";
const log4js = require('koa-log4');
const config = require('../config/config');
const log4js_config = require("../config/log4js");
log4js.configure(log4js_config);

let Log4 = {
  self:log4js
};

if(config.env ==config.ENVTYPE.DEV){
  Log4.log= log4js.getLogger('console');
  Log4.httpLog= log4js.getLogger('console');
  Log4.checkLog= log4js.getLogger('console');
}else{
  Log4.log= log4js.getLogger('log_file');
  Log4.httpLog= log4js.getLogger('http_file');
  Log4.checkLog= log4js.getLogger('log_check_err');
}

Log4.log.info("log_start init start!");

Log4.log.debug('We Write Logs with log4js');
Log4.log.info('You can find logs-files in the logs dir');
Log4.log.warn('log-dir is a configuration-item in the ./config/log4js.js');
Log4.log.error('In This Test log-dir is : \'./logs/log_file/\'');

Log4.log.info("log_start init end!");

module.exports = Log4;
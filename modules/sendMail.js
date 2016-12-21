/**
 * Created by weijianli on 16/12/2.
 */
"use strict";
const nodemailer = require('nodemailer');
const config = require('../config/config');
const logger = require("../modules/log4js").checkLog;


var smtpTransport = nodemailer.createTransport(config.smtpConfig);


// send mail with defined transport object
function sendMail(content) {
  logger.info('send Mail: ' + content);
  config.mailOptions.html = content;
  smtpTransport.sendMail(config.mailOptions, function(error, info){
    if(error){
      logger.error(error);
      return;
    }
    logger.info('Message sent: ' + info.response);
  });
}

module.exports = sendMail;
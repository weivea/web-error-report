/**
 * Created by weijianli on 16/12/1.
 */
"use strict";
const mysql = require('mysql');
const co = require('co');
const dateFormat = require('./dateFormat');
const config = require('../config/config');
const loger = require("../modules/log4js").log;

function saver() {
  this.connection = null;
  this.threadId = null;
  this.connectFlag = false;
  this.workingFlag = false;
  this.timer = null;
  var self = this;
  this.saveFun = co.wrap(function *(data) {
    self.lazyClose();
    if (self.connectFlag) {
      yield self.insert(data)
    } else {
      yield self.connect();
      yield self.insert(data);
    }
  });
}


/**
 * 链接数据库
 * */
saver.prototype.connect = function () {
  var self = this;
  return new  Promise(function (resolve, reject) {
    self.connection = mysql.createConnection(config.reportDb);
    self.connection.connect(function(err) {
      if (err) {
        loger.error('mysql connecting error: ' + err.stack);
        reject(err)
      }else {
        self.connectFlag = true;
        self.threadId = self.connection.threadId;
        loger.info('mysql connected as id ' + self.connection.threadId);
        resolve();
      }
    });
  });
}

/**
 * 插入数据
 * */
saver.prototype.insert = function(data) {
  var self = this;
  return new Promise(function (resolve, reject) {
    loger.info(`insert data:${JSON.stringify(data)}`);
    var queryStr = `INSERT INTO err_report ( url, user_agent, cookie, err_data)
                       VALUES
                       ( "${data.url}", "${data.userAgent}", "${data.cookie}", "${data.errData}");`;
    self.connection.query(queryStr, function (err, OkPacket) {
      if (err) {
        loger.error(`insert error: ${err}`);
        reject(err)
      } else {
        loger.info(`insert result:${JSON.stringify(OkPacket)}`);
        resolve(OkPacket);
      }
    });
  });
}
/**
 *断开与数据库的链接
 * */
saver.prototype.close = function () {
  var self = this;
  if (this.connectFlag == true) {
    this.connectFlag = false;
    this.connection.end(function (err) {
      if (err) {
        loger.error(`mysql report ${self.threadId} end: ${err}`);
      } else {
        loger.info(`mysql report ${self.threadId} end`);
      }
    })
  }
}

/**
 *  延时 断开与数据库的链接
 * */
saver.prototype.lazyClose = function() {
  var self =this;
  if(self.timer){
    clearTimeout(self.timer);self.timer = null;
  }
  this.timer = setTimeout(function () {
    self.close();
  },10000);
}



saver.prototype.save = function (data,cb) {
  var self = this;
  if(!self.workingFlag){
    self.workingFlag = true;
    self.saveFun(data).then(function (val) {
      self.workingFlag = false;
      cb(null,val);
    }).catch(function (err) {
      self.workingFlag = false;
      cb(err);
    });
  }
}

module.exports = saver;
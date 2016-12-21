"use strict";
const config = require('../config/config');
const loger = require("../modules/log4js").log;
const reportSQLPool = require("./reportSQLPool");


let dataArray = [];
let writingFlag = false;

/**
 * 数据进入
 * */
function inWrite(datas) {
  if(dataArray.length > config.reportBufferLength){
    return;
  }
  var url = datas.url;
  var userAgent = datas.userAgent;
  var cookie = datas.cookie;
  var errData = datas.errData;

  if (!url || !userAgent || !errData) {
    loger.error(`report param error: ${JSON.stringify(datas)}`);
    return;
  }
  dataArray.push({
    url: encodeURIComponent(url),
    userAgent: encodeURIComponent(userAgent),
    cookie: encodeURIComponent(cookie),
    errData: encodeURIComponent(errData)
  });
  if (!writingFlag && dataArray.length > 0) {
    writingFlag = true;
    saveToDb();
  }
}

/**
 * 保存到数据库
 * */
function saveToDb() {
  if(dataArray.length>0){
    var data = dataArray.shift();
    reportSQLPool.doSave(data, function (err) {
      if (err) {
        writingFlag = false;
        loger.error(`saveData fail: ${JSON.stringify(dataArray)}`);
      } else {
        if(dataArray.length == 0){
          writingFlag = false;
        }else {
          saveToDb();
        }
      }
    })
  }
}

/**
 * 获取bufffer长度
 * */
function getLength() {
  return dataArray.length
}

module.exports = {
  inWrite: inWrite,
  getLength: getLength
};
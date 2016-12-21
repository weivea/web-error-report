/**
 * Created by weijianli on 16/12/2.
 */
"use strict";
const mysql = require('mysql');
//const _ = require('lodash');
const co = require('co');
const dateFormat = require('./dateFormat');
const config = require('../config/config');
const sendMail = require('./sendMail');
const logger = require("../modules/log4js").checkLog;
const connection = mysql.createConnection(config.reportDb);

//查询前一个小时的数据
const timeLast = 3600;

/**
 * 链接数据库
 * */
function connect() {
  return new  Promise(function (resolve, reject) {
    connection.connect(function(err) {
      if (err) {
        logger.error('mysql connecting error: ' + err.stack);
        reject(err)
      }else {
        logger.info('mysql connected as id ' + connection.threadId);
        resolve();
      }
    });
  });
}

/**
 *断开与数据库的链接
 * */
function close() {
  connection.end(function (err) {
    if(err){
      logger.error(`mysql end: ${err}`);
    }else{
      logger.info(`mysql end`);
    }
  })
}


/**
 * 获取数据
 * */
function read() {
  return new Promise(function (resolve, reject) {
    //前一个小时的数据
    var time = dateFormat.call((new Date((new Date).getTime() - timeLast*1000)),'yyyy-MM-dd hh:mm:ss')
    var queryStr = `SELECT * FROM err_report where created_at > '${time}';`;
    logger.info(`queryStr: ${queryStr}`);
    connection.query(queryStr, function (err, rows) {
      if (err) {
        logger.error(`query error: ${err}`);
        reject(err)
      } else {
        logger.info(`query result:${JSON.stringify(rows)}`);
        resolve(rows,time);
      }
    });
  });
}

/**
 * 根据数据生成邮件内容
 * */
function generateHtml(rows){
  var keys = Object.keys(rows[0]);
  var tHeader = keys.reduce(function (prev,item,index) {
    prev = (index == 1)?`<th>${ decodeURIComponent(prev)}</th>`:prev;
    return prev + `<th>${decodeURIComponent(item)}</th>`
  })
  var tBody = '';
  rows.forEach(function (row) {
    var tRow = keys.reduce(function (prev,item,index) {
      prev = (index == 1)?`<td>${decodeURIComponent(row[prev])}</td>`:prev;
      return prev + `<td>${decodeURIComponent(row[item])}</td>`
    });
    tBody = tBody + `<tr>${tRow}</tr>`
  });

  var html = `
<div>
<style  type="text/css">
table#xy-err-report{
  border-collapse:collapse;
  white-space:nowrap;
}
table#xy-err-report, td, th{
  border:1px solid black;
}
</style>
<table id="xy-err-report">
  <tr>
    ${tHeader}
  </tr>
  ${tBody}
</table>
</div>`;
  return html;
}


/**
 *检测是否存在新增错误记录
 * */
const errorCheck = co.wrap(function *() {
  yield connect();
  var rows = yield read();
  if(rows && rows.length>0){
    //logger.info(generateHtml(rows))
    sendMail(generateHtml(rows));
  }
  close();
  return;
});

logger.info('errorCheck start!');
errorCheck().then(function (val) {
  logger.info('errorCheck done!');
}).catch(function (err) {
  logger.info(err);
});
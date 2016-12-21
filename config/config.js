/**
 * Created by weijianli on 16/11/30.
 */
"use strict";

//标识运行环境
const ENV = {
  DEV:1,
  TEST:2,
  PRODUCT:3
};

module.exports = {
  env:ENV.DEV,//配置运行环境
  port:5000,//服务端口号
  //env:ENV.TEST,
  ENVTYPE:ENV,

  reportBufferLength:1000000,//缓冲区数据条数的长度
  reportSQLPoolNum:5,//上报数据入库连接数

  errorCheckTimeLast:300,//单位:秒,表示检测300秒之前的错误记录

  //允许上报的域名配置
  validDomain:{
    "localhost":true,
    "127.0.0.1":true
  },
  //上报数据库
  reportDb:{
    host     : '127.0.0.1',
    port     : '3306',
    user     : 'root',
    password : '',
    database : 'xy_web_err_report'
  },
  //邮件账户配置
  smtpConfig: {
    host: "smtp.exmail.qq.com", // 主机
    secure: true, // 使用 SSL
    port: 465, // SMTP 端口
    auth: {
      user: "xxx@xxx.com", // 账号
      pass: "xxx" // 密码
    }
  },

  //邮件发送配置
  mailOptions: {
    from: '"xxxx 👥" <xxx@xxx.com>', // sender address
    to: 'yyy@yyyy.com', // list of receivers
    subject: 'web error report', // Subject line
    text: 'web前端北京，错误上报 🐴', // plaintext body
    html: '<b>Hello world 🐴</b>' // html body
  }

};
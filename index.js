/**
 * Created by weijianli on 16/11/30.
 */
"use strict";
const config = require('./config/config');
const log4js = require("./modules/log4js");
const loger = log4js.log;
const serve = require('koa-static');
const koa = require('koa');
const json = require('koa-json');
const app = koa();
//routes
const koa_router = require('koa-router')();
const acceptor = require('./routes/acceptor');
const web = require('./routes/web');

app.on('error', function (err, ctx) {
  loger.error('server error', err, ctx)
})

app.use(json());
//静态资源初始化
app.use(serve(__dirname + '/public'));

//httplog初始化
app.use(log4js.self.koaLogger(log4js.httpLog, { level: 'auto' }));


//路由配置
koa_router.use('/', web.routes(),web.allowedMethods());
koa_router.use('/err_report', acceptor.routes(),acceptor.allowedMethods());
// mount root routes
app.use(koa_router.routes())

if(module.parent){
  module.exports = function(){
    app.listen(config.port);
    loger.info(`PID: ${process.pid} ,listening on port :${config.port}`);
  }
}else{
  app.listen(config.port);
  loger.info(`PID: ${process.pid} ,listening on port :${config.port}`);
}
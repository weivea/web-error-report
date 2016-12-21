/**
 * Created by weijianli on 16/11/30.
 */
const router = require('koa-router')()
const loger = require("../modules/log4js").log;
const render = require('../modules/artTemplate/index')

router.get('', function * (next) {
  this.body = yield render('index',{})
})
router.get('test', function * (next) {
  this.body = yield render('test',{})
})

module.exports = router
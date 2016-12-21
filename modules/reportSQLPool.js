/**
 * Created by weijianli on 16/12/3.
 */
const config = require('../config/config');
const logger = require("../modules/log4js").log;
const saveReportData = require("./saveReportData");


let poolBusy = {};
let poolIdle = {};
let poolKeys = []
//初始化连接池
for (var poolNumInd = 0; poolNumInd < config.reportSQLPoolNum; poolNumInd++) {
  let _saver = new saveReportData();
  poolIdle[poolNumInd] = {
    saver: _saver,
    // saveFun: createSaveFun(poolNumInd,_saver)
    saveFun: ((key,saver) => (data,cb) => {
      poolBusy[key] = poolIdle[key];
      poolIdle[key] = undefined;
      saver.save(data, function (err) {
        if (err) {
          logger.error(`saveData fail: ${JSON.stringify(dataArray)}`);
        }
        poolIdle[key] = poolBusy[key];
        poolBusy[key] = undefined;
        cb(err);
      })
    })(poolNumInd,_saver)
  }
}
poolKeys = Object.keys(poolIdle);

// function createSaveFun(key,saver) {
//   return function (data,cb) {
//     poolBusy[key] = poolIdle[key];
//     poolIdle[key] = undefined;
//     saver.save(data, function (err) {
//       if (err) {
//         logger.error(`saveData fail: ${JSON.stringify(dataArray)}`);
//       }
//       poolIdle[key] = poolBusy[key];
//       poolBusy[key] = undefined;
//       cb(err);
//     })
//   }
// }


function doSave(data,cb) {
  for (var poolNumInd in poolIdle) {
    if(poolIdle[poolNumInd]){
      poolIdle[poolNumInd].saveFun(data, cb);
      break;
    }
  }
  for (var poolNumInd in poolIdle) {
    if(poolIdle[poolNumInd]){
      cb();
      break;
    }
  }
}

module.exports = {
  doSave:doSave
};
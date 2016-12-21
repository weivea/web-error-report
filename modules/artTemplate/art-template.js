/**
 * Created by weijianli on 16/4/22.
 */
var node = require('./_node.js');
var template = require('./template-debug.js');

module.exports = function (option) {
  var artTemplate = node(template());
  for(var key in option){
    artTemplate.config(key, option[key]);
  }
  return function (tpl,data) {
    data = data||{};
    return new Promise(function (resolve, reject) {
      try {
        var html = artTemplate.renderFile(tpl,data);
        resolve(html);
      } catch (e) {
        reject(e);
      }
    })
  }
};
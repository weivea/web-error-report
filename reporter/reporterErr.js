/**
 * Created by weijianli on 16/12/5.
 */
;(function () {
  var callback;

  var pageUrl = encodeURIComponent(location.href);
  var userAgent = encodeURIComponent(navigator.userAgent);
  var reportUrl = location.origin + "/err_report";



  if(!window.xy_bj_reporter){
    window.xy_bj_reporter = {};
  }
  window.xy_bj_reporter.reportErr = reportErr

  addHandler(window,'error',function (msg, srcUrl, lineNo, col, error) {

    var newMsg = msg;
    if (error && error.stack) {
      newMsg = _processStackMsg(error);
    }
    if (_isOBJByType(newMsg, /Event/)) {
      srcUrl = newMsg.filename || srcUrl;
      lineNo = newMsg.lineno || lineNo;
      if(newMsg.error){
        newMsg = newMsg.error.stack || newMsg.error.message
      }else {
        newMsg += newMsg.type ?
          ("--" + newMsg.type + "--" + (newMsg.target ?
            (newMsg.target.tagName + "::" + newMsg.target.src) : "")) : "";
      }
    }


    report(newMsg,srcUrl,lineNo);
  });


  function reportErr(op) {
    report(op.msg,op.srcUrl,op.lineNo,op.errDesc);
  }

  function reportFun(errData) {
    setTimeout(function () {
      var cookie = encodeURIComponent(document.cookie);
      var img = document.createElement('img');
      img.onerror = function (e) {
        callback && callback(e);
      };
      img.onload = function (e) {
        callback && callback(null,e);
      };
      img.src = reportUrl+"?url="+pageUrl+"&userAgent="+userAgent+"&cookie="+cookie+"&errData="+errData;
    },0);
    return {
      then:function (cb) {
        callback = cb;
      }
    }
  }

  //错误上报函数
  function report(msg,srcUrl,lineNo,errDesc) {
    var err = {
      msg:msg,
      srcUrl:srcUrl,
      lineNo:lineNo,
      errDesc:errDesc
    };
    reportFun(encodeURIComponent(JSON.stringify(err)));

  }
  //添加事件监听兼容函数
  function addHandler(target, eventType, handler){
    if(target.addEventListener){//主流浏览器
        target.addEventListener(eventType, handler, false);
    }else{//IE
      target.attachEvent("on"+eventType, handler);
    }
  }

  function _processStackMsg(error) {
    var stack = error.stack
      .replace(/\n/gi, "")
      .split(/\bat\b/)
      .slice(0, 9)
      .join("@")
      .replace(/\?[^:]+/gi, "");
    var msg = error.toString();
    if (stack.indexOf(msg) < 0) {
      stack = msg + "@" + stack;
    }
    return stack;
  }
  function _isOBJByType (o, type) {
    return type.test(Object.prototype.toString.call(o));
  }

})();
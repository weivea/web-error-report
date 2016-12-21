/**
 * Created by weijianli on 16/8/17.
 */

/*var example = {
  "protover": 1,
  "softid": 1,

  "local_time": 1471504415692,
  "userid": "",
  "cmdid": 5016,
  "sessionid": "",
  "referer": "",
  "cookie": "uuid=74368333722419200; source=10001",
  "ostype": 2,
  "osver": "",
  "clientver": "",
  "channelid": "",
  "deviceid": "",
  "sessionId": "",
  "source": 4,
  "buttonid": 104,
  "act_cid": "shipinll201605_m"
}*/

;(function () {

function reporter() {
  this._on_report = getCookie('_no_report');//是否上报
  this.browserVersion=browserVersion();
  this.params={
    protover:1,
    softid:'',
    envid:'',
    cmdid:'',
    local_time:'',
    userid:getCookie('uid'),
    source:1,
    cookie:document.cookie,
    referer:'',
    ostype:'',
    osver:'',
    clientver:'',
    channelid:'',
    deviceid:''
  };
  //this.img = document.createElement('img');
  this.reportTmp = {};

  this.rqUrl = 'https://r.xiaoying.com/web?param=';
  this.viewParam = {cmdid:5001,param:location.search,url:location.href};//访问上报数据

  var u = window.navigator.userAgent;
  //产品id
  if(u.indexOf('kadaiApp') != -1){//卡贷
    this.params.softid = 5;
    this.params.envid = 5;
  }else if(u.indexOf('yingztApp') != -1){//小赢理财
    this.params.softid = 1;
    this.params.envid = 1;
  }else if(u.indexOf('chengdanApp') != -1){//成单
    this.params.softid = 3;
    this.params.envid = 3;
  }else if(u.indexOf('youdanApp') != -1){//有单
    this.params.softid = 4;
    this.params.envid = 4;
  }
  //web页来源
  if(this.browserVersion.weixin){
    this.params.source = 2;
  }else if(this.browserVersion.webApp){
    this.params.source = 3;
  }else if(this.browserVersion.mobile){
    this.params.source = 4;
  }

  //来自那个链接
  if(document.referrer){
    this.params.referer = document.referrer||'';
  }
  //系统类型
  if(this.browserVersion.android){
    this.params.ostype = 1
  }else if(this.browserVersion.ios){
    this.params.ostype = 2
  }else{
    this.params.ostype = 3
  }
  //系统版本号
  var mc;
  if(this.browserVersion.ios){
    mc = u.match(/iP.+OS\s([\d]{1,2}_[\d]{1,2}\s|[\d]{1,2}_[\d]{1,2}_[\d]{1,2}\s)/);
    if(mc && mc[1]){
      this.params.osver = mc[1].replace(/\s/g,'').replace(/_/g,'.');
    }
  }else if(this.browserVersion.android){
    mc = u.match(/Android\s([\d]{1,2}\.[\d]{1,2};|[\d]{1,2}\.[\d]{1,2}\.[\d]{1,2};)/);
    if(mc && mc[1]){
      this.params.osver = mc[1].replace(/;/g,'');
    }
  }
  //客户端版本号
  if(u.indexOf('yingztApp') != -1){
    mc = u.match(/yingztApp\/([\d]{1,2}\.[\d]{1,2}\.[\d]{1,2})/);
    if(mc && mc[1]){
      this.params.clientver = mc[1];
    }
  }else if(u.indexOf('chengdanApp') != -1){
    mc = u.match(/chengdanApp\/([\d]{1,2}\.[\d]{1,2}\.[\d]{1,2})/);
    if(mc && mc[1]){
      this.params.clientver = mc[1];
    }
  }else if(u.indexOf('kadaiApp') != -1){
    mc = u.match(/kadaiApp\/([\d]{1,2}\.[\d]{1,2}\.[\d]{1,2})/);
    if(mc && mc[1]){
      this.params.clientver = mc[1];
    }
  }else if(u.indexOf('youdanApp') != -1){
    mc = u.match(/youdanApp\/([\d]{1,2}\.[\d]{1,2}\.[\d]{1,2})/);
    if(mc && mc[1]){
      this.params.clientver = mc[1];
    }
  }
  //渠道号
  mc = u.match(/\(channelid\/([^\s]+)\)/);
  if(mc && mc[1]){
    this.params.channelid = mc[1];
  }
  //设备编号
  mc = u.match(/\(deviceid\/([^\s]+)\)/);
  if(mc && mc[1]){
    this.params.deviceid = mc[1];
  }else {
    this.params.deviceid = getCookie('uuid');
  }

  this.init();
  //显示状态改变上报
  this.viewchRP();
  //访问上报
  var self =this;
  addHandler(window,'load',function(){
    self.report(self.viewParam);
  })
}

reporter.prototype.reBootstrap = function () {
  this.params.userid = getCookie('uid');
  this.params.cookie =  document.cookie;
};
reporter.prototype.init = function (op) {
  if(!op){
    op = window._xy_bj_reporter_init;
    if(!op){
      return;
    }
  }
  for(var key in op){
    if(typeof op[key] == 'string' || typeof op[key] == 'number'){
      this.params[key] = op[key];
    }
  }
};
reporter.prototype.report = function (op) {
  if(this._on_report == 1){
    window.console&&window.console.log('_on_report:数据不上报~~');return;
  }
  if(!op){op={};}
  var self = this;
  var para = {};
  for(var k in this.params){
    para[k] = this.params[k];
  }
  for(var key in op){
    if(typeof op[key] == 'string' || typeof op[key] == 'number'){
      para[key] = op[key];
    }
  }
  if(!para.cmdid){
    if(window.console){
      console.log('数据上报缺少cmdid');
    }
    return;
  }
  para.local_time =(new Date()).getTime();
  var tmpUrl = this.rqUrl+encodeURIComponent(JSON.stringify(para));

  //一秒钟以内的相同数据不上报
  if(this.reportTmp[tmpUrl] && (this.reportTmp[tmpUrl].timestamp+1000>(new Date()).getTime())){
    return;
  }

  this.reportTmp[tmpUrl] = {
    timestamp:para.local_time,
    img:document.createElement('img'),
    cb:null
  };
  var reportTmp = this.reportTmp[tmpUrl];
  this.reportTmp[tmpUrl].img.onerror=this.reportTmp[tmpUrl].img.onload= function (e) {
    if(typeof reportTmp.cb == 'function'){
      reportTmp.cb(e);
    }
    self.reportTmp[tmpUrl] = null;
  };
  this.reportTmp[tmpUrl].img.src = tmpUrl;
  return {
    then:function (cb) {
      reportTmp.cb = cb;
    }
  }

};

reporter.prototype.viewchRP = function () {
  var eName,sName;
  var self = this;
  if(document.visibilityState){
    eName = 'visibilitychange';
    sName = "visibilityState";
  }else if(document.webkitVisibilityState){
    eName = 'webkitvisibilitychange';
    sName = "webkitVisibilityState";
  }
  if(eName){
    addHandler(document,eName,function (e) {
      if(document[sName] == 'visible'){
        self.report(self.viewParam);
        document.cookie = "xy_view_timestamp="+(new Date()).getTime();
      }else if(document[sName] == 'hidden'){
        var xy_view_timestamp = parseInt(getCookie('xy_view_timestamp'));
        if(xy_view_timestamp){
          self.report({cmdid:5017,url:location.href,interval:(new Date()).getTime()-xy_view_timestamp});
        }
      }
    })
  }
};
window.xy_bj_reporter = new reporter();


function getCookie(n){
  var m = document.cookie.match(new RegExp( "(^| )"+n+"=([^;]*)(;|$)"));
  return !m ? "":decodeURIComponent(m[2]);
}

function browserVersion(){
  var u = window.navigator.userAgent;
  return {
    mobile: !!u.match(/AppleWebKit.*Mobile.*/)||!!u.match(/AppleWebKit/), //是否为移动终端
    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
    android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
    webApp: u.indexOf('kadaiApp') != -1 || u.indexOf('yingztApp') != -1 || u.indexOf('chengdanApp') != -1 || u.indexOf('youdanAppApp') != -1, //是否为web应用程序，没有头部与底部
    weixin: u.indexOf('MicroMessenger') != -1
  }
}
//添加事件监听兼容函数  
  function addHandler(target, eventType, handler){
    if(target.addEventListener){//主流浏览器  
      addHandler = function(target, eventType, handler){
        target.addEventListener(eventType, handler, false);
      };
    }else{//IE  
      addHandler = function(target, eventType, handler){
        target.attachEvent("on"+eventType, handler);
      };
    }
    //执行新的函数  
    addHandler(target, eventType, handler);
  }
})();
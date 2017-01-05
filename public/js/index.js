/**
 * Created by weijianli on 16/11/30.
 */
(function () {

  var report_btn = document.getElementById("report-btn");
  report_btn.onclick = function () {
    var aa = window.aa.aa.asdf;
  }
  var report_btn2 =  document.getElementById("report-btn2");
  report_btn2.onclick = function () {
    try{
      window.webReportErr({
        msg:'something wrong!!!',
        srcUrl:"https://xxx.com",
        lineNo:undefined,
        errDesc:"这是个测试错误1"
      });
      window.webReportErr({
        msg:'something wrong!!!',
        srcUrl:"https://xxx.com",
        lineNo:undefined,
        errDesc:"这是个测试错误2"
      });
      window.webReportErr({
        msg:'something wrong!!!',
        srcUrl:"https://xxx.com",
        lineNo:undefined,
        errDesc:"这是个测试错误3"
      });
      window.webReportErr({
        msg:'something wrong!!!',
        srcUrl:"https://xxx.com",
        lineNo:undefined,
        errDesc:"这是个测试错误4"
      });
    }catch (e){
      alert(e);
    }


  }

})();
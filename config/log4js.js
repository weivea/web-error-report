/**
 * Created by weijianli on 16/11/30.
 */
module.exports = {
  "appenders":
    [
      {
        "type":"console",
        "category":"console"
      },
      {
        "category":"log_file",
        "type": "file",
        "filename": "./logs/log_file/file.log",
        "maxLogSize": 104800,
        "backups": 10
      },
      {
        "category":"log_check_err",
        "type": "file",
        "filename": "./logs/log_file/check_err.log",
        "maxLogSize": 104800,
        "backups": 10
      },
      {
        "category":"http_file",
        "type": "file",
        "filename": "./logs/log_file/http.log",
        "maxLogSize": 104800,
        "backups": 10
      }
    ],
  "replaceConsole": true,
  "levels":
  {
    "test_file":"ALL",
    "log_file":"ALL",
    "console":"ALL"
  }
}
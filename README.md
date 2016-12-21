# web-error-report
web端的错误上报系统,基本上还只有基本上报插件、上报接收服务，错误邮件提醒服务，数据存储基于mysql

## Usage

### 数据库建表

```
CREATE TABLE `err_report` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `url` longtext,
  `user_agent` longtext,
  `cookie` longtext,
  `err_data` longtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26187 DEFAULT CHARSET=utf8;
```

### 服务启动

```

git clone https://github.com/weivea/web-error-report.git
cd web-error-report

# 安装依赖
npm install

# 压缩插件
gulp build

# 启动服务
sh app.sh start

# 当然也可以node index.js
```

### 错误上报

```
<script src="/js/reporter/reporterErr_min.js"></script>
<script>
//1.window.onerror被动上报错误，

//2.主动上报
window.webReportErr({
    msg:'something wrong!!!',
    srcUrl:"https://xxx.com",
    lineNo:undefined,
    errDesc:"这是个测试错误1"
})
</script>

```

### 错误提醒
这里采用crontab来跑errorChecker.js，以邮件的形式发送

crontab配置：

```
*/5 * * * * path-to/bin/node path-to-dir(项目路径)/modules/errorChecker.js

```


### 配置项

```
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
```

/**
 * Created by weijianli on 16/2/24.
 */
const cluster = require('cluster');
const app = require('./index.js');
const numCPUs = require('os').cpus().length;//cpu核心数
// const numCPUs = 1;//cpu核心数

if (cluster.isMaster) {//不是主进程，则fork workers
    // Fork workers.
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    cluster.on('exit', (worker, code, signal) => {//有子进程退出了则重新fork
        console.log((new Date()).toLocaleString()+`:worker ${worker.process.pid} died,restart..` );
        cluster.fork();
    });
} else {
    app();//启动app
}
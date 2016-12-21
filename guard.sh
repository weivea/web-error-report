#!/bin/sh
WEB_DIR=`pwd;`
WEB_APP='cluster.js'

#location of node you want to use
NODE_EXE=`which node;`

while true; do
    {
        $NODE_EXE $WEB_DIR/$WEB_APP
        DATE_S=`date;`
        echo "$DATE_S:Stopped unexpected, restarting \r\n\r\n" >> $WEB_DIR/error.log
    } 2>> $WEB_DIR/error.log
    sleep 2s
done
#!/bin/sh

WEB_DIR=`pwd;`

WEB_APP='cluster.js'

GUARD='guard.sh'

guardPID=`ps -ef | grep $WEB_DIR/$GUARD | grep -v grep | head -n 1 | awk '{print $2}'`

pid=`ps -ef | grep $WEB_DIR/$WEB_APP | grep -v grep | head -n 1 | awk '{print $2}'`

if [ $1 ] && [ $1 == 'start' ]

then
if [ $guardPID ] && [ $pid ]
then
    DATE_S=`date;`
    echo "restart:$DATE_S"
    echo "restart:$DATE_S" >> $WEB_DIR/error.log
    kill $pid
else
    DATE_S=`date;`
    echo "start:$DATE_S"
    echo "start:$DATE_S" >> $WEB_DIR/error.log
    if [ $guardPID ]
    then
    kill $guardPID
    fi
    if [ $pid ]
    then
    kill $pid
    fi
    nohup $WEB_DIR/$GUARD&
fi

elif [ $1 ] && [ $1 == 'stop' ]
then
    DATE_S=`date;`
    echo "stop:$DATE_S"
    echo "stop:$DATE_S" >> $WEB_DIR/error.log
    if [ $guardPID ]
    then
    kill $guardPID
    fi
    if [ $pid ]
    then
    kill $pid
    fi
else

echo " use: $0 start    or    $0 stop"

fi



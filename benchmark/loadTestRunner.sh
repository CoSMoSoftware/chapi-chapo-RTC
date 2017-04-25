#!/bin/sh

target=1000000
increment=20000

max=3 #`expr $target/increment`
a=1
until [ $a -gt $max ]
do
   node loadTest.js tester-$a &
   a=`expr $a + 1`
done



#!/bin/bash

echo 'Starting ARZA…'

killall -KILL php
sleep 1 && open -F -a '/Applications/Google Chrome.app' 'http://localhost:8888' &
php -S localhost:8888

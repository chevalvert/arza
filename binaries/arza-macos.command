#!/bin/bash

cd "$(dirname "$0")"

echo 'Killing existing process…'
killall -KILL arza-macos

echo 'Starting ARZA…'
./arza-macos

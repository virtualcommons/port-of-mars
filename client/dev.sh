#!/usr/bin/env bash

set -o errexit

npm install
exec npm run serve


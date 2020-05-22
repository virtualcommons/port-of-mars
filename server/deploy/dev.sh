#!/usr/bin/env bash

set -o errexit

yarn install
./deploy/wait-for-it.sh db:5432 -- echo "db ready"
exec yarn start

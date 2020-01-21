#!/usr/bin/env bash

./wait-for-it.sh db:5432 -- echo "db ready"
exec yarn start:prod

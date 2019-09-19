#!/usr/bin/env bash

set -o errexit

yarn install
exec yarn start


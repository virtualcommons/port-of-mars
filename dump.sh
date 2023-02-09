#!/usr/bin/env bash

set -o nounset
set -o pipefail
set -o errexit

ENV=$1
shift

case "$ENV" in
  dev) docker compose exec server yarn cli dump "$@";;
  *)   docker compose exec server yarn cli:prod dump "$@";;
esac

docker run -it --rm -v $PWD/analytics:/home/analytics -v $PWD/docker/dump:/dump -w /home/analytics rocker/tidyverse:3 Rscript R/export.R

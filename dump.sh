#!/usr/bin/env bash

#######
# usage
# ./dump.sh (prod|dev) --tournamentId <tournamentId>


set -o nounset
set -o pipefail
set -o errexit

ENV=$1
shift

case "$ENV" in
  prod)   docker compose exec server yarn cli:prod dump tournament "$@";;
  *) docker compose exec server yarn cli dump tournament "$@";;
esac

docker run -it --rm -v $PWD/analytics:/home/analytics -v $PWD/docker/dump:/dump -w /home/analytics rocker/tidyverse:3 Rscript R/export.R

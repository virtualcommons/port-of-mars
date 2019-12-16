#!/usr/bin/env bash

set -o nounset
set -o pipefail
set -o errexit

build() {
  build_template $1
  docker-compose build --pull 
}

build_template() {
  docker-compose -f base.yml -f "$1.yml" config > docker-compose.yml
}

deploy() {
  build $1
  docker-compose up -d
}

test_app() {
  build $1
  docker-compose run --rm client yarn test:unit
}

case "${1:-deploy}" in
  'build') build "${2:-prod}";;
  'deploy') deploy "${2:-prod}";;
  'test') test_app "${2:-dev}";;
  'template') build_template "${2:-prod}";;
  *) echo "Invalid option choose one of deploy, build" 1>&2; exit 1;;
esac

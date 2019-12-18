#!/usr/bin/env bash

set -o nounset
set -o pipefail
set -o errexit

DB_PASSWORD_PATH=server/deploy/pom_db_password

build() {
  build_template $1
  docker-compose build --pull 
}

build_template() {
  docker-compose -f base.yml -f "$1.yml" config > docker-compose.yml
}

set_secrets() {
  local DB_PASSWORD=$(head /dev/urandom | tr -dc '[:alnum:]' | head -c42)
  local TODAY=$(date +%Y-%m-%d-%H:%M:%S)
  if [[ -f "$DB_PASSWORD_PATH" ]]; then
    cp server/deploy/pom_db_password "server/deploy/pom_db_password_$TODAY"
  fi
  echo $DB_PASSWORD > server/deploy/pom_db_password
  sed "s|DB_PASSWORD|$DB_PASSWORD|g" server/ormconfig.template.json > server/ormconfig.json
}

init() {
  set_secrets
  build $1
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
  'init') init "${2:-prod}";;
  'secrets') set_secrets;;
  'test') test_app "${2:-dev}";;
  'template') build_template "${2:-prod}";;
  *) echo "Invalid option choose one of deploy, build" 1>&2; exit 1;;
esac

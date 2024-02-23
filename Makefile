DB_DATA_PATH=docker/data
DATA_DUMP_PATH=docker/dump
LOG_DATA_PATH=docker/logs

DB_PASSWORD_PATH=keys/pom_db_password
PGPASS_PATH=keys/.pgpass
SECRET_KEY_PATH=keys/secret_key
GENERATED_SECRETS=$(DB_PASSWORD_PATH) $(PGPASS_PATH) $(SECRET_KEY_PATH)
EXT_SECRETS=mail_api_key google_client_secret facebook_client_secret

ENVREPLACE := deploy/scripts/envreplace
DEPLOY_CONF_DIR=deploy/conf
ENV_TEMPLATE=${DEPLOY_CONF_DIR}/.env.template
DYNAMIC_SETTINGS_TEMPLATE=${DEPLOY_CONF_DIR}/settings.template.json
DYNAMIC_SETTINGS_PATH=keys/settings.json

include config.mk
include .env

.EXPORT_ALL_VARIABLES:

$(LOG_DATA_PATH):
	mkdir -p $(LOG_DATA_PATH)

$(DB_DATA_PATH):
	mkdir -p "$(DB_DATA_PATH)"

$(DATA_DUMP_PATH):
	mkdir -p $(DATA_DUMP_PATH)

keys:
	mkdir -p keys

$(DYNAMIC_SETTINGS_PATH): $(DYNAMIC_SETTINGS_TEMPLATE) | keys
	cp $(DYNAMIC_SETTINGS_TEMPLATE) $(DYNAMIC_SETTINGS_PATH)

$(DB_PASSWORD_PATH): | keys
	DB_PASSWORD=$$(openssl rand -base64 48); \
	TODAY=$$(date +%Y-%m-%d-%H:%M:%S); \
	if [ -f $(DB_PASSWORD_PATH) ]; \
	then \
	  cp "$(DB_PASSWORD_PATH)" "$(DB_PASSWORD_PATH)_$$TODAY"; \
	fi; \
	echo "$${DB_PASSWORD}" > $(DB_PASSWORD_PATH)

$(PGPASS_PATH): $(DB_PASSWORD_PATH) | keys
	echo "${DB_HOST}:5432:*:${DB_USER}:$$(cat $(DB_PASSWORD_PATH))" > $(PGPASS_PATH)
	chmod 0600 $(PGPASS_PATH)

$(SECRET_KEY_PATH): | keys
	SECRET_KEY=$$(openssl rand -base64 48); \
	echo $${SECRET_KEY} > $(SECRET_KEY_PATH)

.PHONY: secrets
secrets: keys $(GENERATED_SECRETS)
	for secret_path in $(EXT_SECRETS); do \
		touch keys/$$secret_path; \
	done

.env: $(ENV_TEMPLATE)
	if [ ! -f .env ];  then \
		cp $(ENV_TEMPLATE) .env; \
	fi

.PHONY: release-version
release-version: .env
	$(ENVREPLACE) RELEASE_VERSION $$(git describe --tags --abbrev=1) .env

docker-compose.yml: base.yml $(DEPLOY_ENVIRONMENT).yml config.mk $(DB_DATA_PATH) $(DATA_DUMP_PATH) $(LOG_DATA_PATH) $(DYNAMIC_SETTINGS_PATH) secrets $(PGPASS_PATH) release-version
	case "$(DEPLOY_ENVIRONMENT)" in \
	  dev|staging|prod) docker compose -f base.yml -f "$(DEPLOY_ENVIRONMENT).yml" config > docker-compose.yml;; \
	  *) echo "invalid environment. must be either dev, staging or prod" 1>&2; exit 1;; \
	esac

.PHONY: build
build: docker-compose.yml
	docker compose pull db redis
	docker compose build --pull

.PHONY: deploy
deploy: build
	docker compose up -d 

.PHONY: buildprod
buildprod: docker-compose.yml
	docker compose run --rm client npm run build
	docker compose run --rm server npm run build

.PHONY: initialize
initialize: build
	docker compose run --rm server npm run initdb

.PHONY: test-setup
test-setup: docker-compose.yml
	docker compose run --rm server bash -c "dropdb --if-exists -h ${DB_HOST} -U ${DB_USER} ${TEST_DB_NAME} && createdb -h db -U ${DB_USER} ${TEST_DB_NAME} && npm run test-setup"

.PHONY: test
test: test-setup
	docker compose run --rm client npm run test:unit
	docker compose run --rm server npm run test

.PHONY: test-server
test-server: test-setup
	docker compose run --rm server npm run test

.PHONY: docker-clean
docker-clean:
	docker volume prune -a -f
	docker compose down
	docker compose build --pull --no-cache

.PHONY: clean
clean:
	@echo "Backing up generated files to /tmp directory"
	mv .env config.mk docker-compose.yml $(shell mktemp -d)

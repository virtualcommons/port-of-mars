include config.mk

DB_USER=marsmadness
TEST_DB_NAME=pom_testing
DB_DATA_PATH=docker/data
DATA_DUMP_PATH=docker/dump
LOG_DATA_PATH=docker/logs
DB_PASSWORD_PATH=keys/pom_db_password
REDIS_SETTINGS_PATH=keys/settings.json
SERVER_ENV_TEMPLATE=server/.env.template
SERVER_ENV=server/.env
PGPASS_PATH=keys/.pgpass
SECRET_KEY_PATH=keys/secret_key
SENTRY_DSN_PATH=keys/sentry_dsn
SENTRY_DSN=$(shell cat $(SENTRY_DSN_PATH))
MAIL_API_KEY_PATH=keys/mail_api_key
SECRETS=$(MAIL_API_KEY_PATH) $(DB_PASSWORD_PATH) $(PGPASS_PATH) $(SENTRY_DSN_PATH) $(SECRET_KEY_PATH)
SHARED_CONFIG_PATH=shared/src/assets/config.ts
BUILD_ID=$(shell git describe --tags --abbrev=1)
GA_TAG_PATH=keys/ga_tag
GA_TAG=$(shell cat $(GA_TAG_PATH))

.PHONY: build
build: docker-compose.yml
	docker compose pull db redis
	docker compose build --pull

.PHONY: browser
browser:
	firefox --new-tab --url 'ext+container:name=Bob&url=http://localhost:8081/#/game' \
		--new-tab --url 'ext+container:name=Amanda&url=http://localhost:8081/#/game' \
		--new-tab --url 'ext+container:name=Frank&url=http://localhost:8081/#/game' \
		--new-tab --url 'ext+container:name=Sydney&url=http://localhost:8081/#/game' \
		--new-tab --url 'ext+container:name=Adison&url=http://localhost:8081/#/game' \
		--new-tab --url 'ext+container:name=Bob2&url=http://localhost:8081/#/game' \
		--new-tab --url 'ext+container:name=Amanda2&url=http://localhost:8081/#/game' \
		--new-tab --url 'ext+container:name=Frank2&url=http://localhost:8081/#/game' \
		--new-tab --url 'ext+container:name=Sydney2&url=http://localhost:8081/#/game' \
		--new-tab --url 'ext+container:name=Adison2&url=http://localhost:8081/#/game'

.PHONY: browser-staging
browser-staging:
	firefox --new-tab --url 'ext+container:name=Bob&url=http://alpha.portofmars.asu.edu' \
		--new-tab --url 'ext+container:name=Amanda&url=http://alpha.portofmars.asu.edu' \
		--new-tab --url 'ext+container:name=Frank&url=http://alpha.portofmars.asu.edu' \
		--new-tab --url 'ext+container:name=Sydney&url=http://alpha.portofmars.asu.edu' \
		--new-tab --url 'ext+container:name=Adison&url=http://alpha.portofmars.asu.edu'

keys:
	mkdir -p keys

$(DB_PASSWORD_PATH): | keys
	DB_PASSWORD=$$(openssl rand -base64 48); \
	TODAY=$$(date +%Y-%m-%d-%H:%M:%S); \
	if [ -f $(DB_PASSWORD_PATH) ]; \
	then \
	  cp "$(DB_PASSWORD_PATH)" "$(DB_PASSWORD_PATH)_$$TODAY"; \
	fi; \
	echo "$${DB_PASSWORD}" > $(DB_PASSWORD_PATH)

$(LOG_DATA_PATH):
	mkdir -p $(LOG_DATA_PATH)

$(DATA_DUMP_PATH):
	mkdir -p $(DATA_DUMP_PATH)

$(REDIS_SETTINGS_PATH): server/deploy/settings.template.json | keys
	cp server/deploy/settings.template.json $(REDIS_SETTINGS_PATH)

$(SERVER_ENV): $(SERVER_ENV_TEMPLATE) $(SECRETS)
	if [ ! -f $(SERVER_ENV) ]; then \
		cp $(SERVER_ENV_TEMPLATE) $(SERVER_ENV); \
		DB_PASSWORD=$$(cat $(DB_PASSWORD_PATH)); \
		SECRET_KEY=$$(cat $(SECRET_KEY_PATH)); \
		sed \
			-e "s|BASE_URL=.*|BASE_URL=${POM_BASE_URL}|" \
			-e "s|DB_PASSWORD=.*|DB_PASSWORD=$${DB_PASSWORD}|" \
			-e "s|SECRET_KEY=.*|SECRET_KEY=$${SECRET_KEY}|" \
			$(SERVER_ENV_TEMPLATE) > $(SERVER_ENV); \
	else \
		echo "$(SERVER_ENV) already exists. skipping"; \
	fi

$(PGPASS_PATH): $(DB_PASSWORD_PATH) server/deploy/pgpass.template | keys
	DB_PASSWORD=$$(cat $(DB_PASSWORD_PATH)); \
	sed "s|DB_PASSWORD|$$DB_PASSWORD|g" server/deploy/pgpass.template > $(PGPASS_PATH)
	chmod 0600 $(PGPASS_PATH)

$(MAIL_API_KEY_PATH): | keys
	touch "$(MAIL_API_KEY_PATH)"

$(SENTRY_DSN_PATH): | keys
	touch "$(SENTRY_DSN_PATH)"

$(GA_TAG_PATH): | keys
	touch "$(GA_TAG_PATH)"

$(DB_DATA_PATH):
	mkdir -p "$(DB_DATA_PATH)"

.PHONY: secrets
secrets: $(SECRETS)

$(SECRET_KEY_PATH): | keys
	SECRET_KEY=$$(openssl rand -base64 48); \
	echo $${SECRET_KEY} > $(SECRET_KEY_PATH)

.PHONY: settings
settings: $(SENTRY_DSN_PATH) $(SECRET_KEY_PATH) $(GA_TAG_PATH) | keys
	echo 'export const BUILD_ID = "${BUILD_ID}";' > $(SHARED_CONFIG_PATH)
	echo 'export const SENTRY_DSN = "${SENTRY_DSN}";' >> $(SHARED_CONFIG_PATH)
	echo 'export const GA_TAG = "${GA_TAG}";' >> $(SHARED_CONFIG_PATH)


initialize: build
	docker compose run --rm server npm run initdb

docker-compose.yml: base.yml $(ENVIR).yml config.mk $(DB_DATA_PATH) $(DATA_DUMP_PATH) $(LOG_DATA_PATH) $(REDIS_SETTINGS_PATH) $(PGPASS_PATH) $(SERVER_ENV) settings
	case "$(ENVIR)" in \
	  dev|staging|prod) docker compose -f base.yml -f "$(ENVIR).yml" config > docker-compose.yml;; \
	  *) echo "invalid environment. must be either dev, staging or prod" 1>&2; exit 1;; \
	esac

.PHONY: test-setup
test-setup: docker-compose.yml
	docker compose run --rm server bash -c "dropdb --if-exists -h db -U ${DB_USER} ${TEST_DB_NAME} && createdb -h db -U ${DB_USER} ${TEST_DB_NAME} && npm run test-setup"

.PHONY: test
test: test-setup
	docker compose run --rm client npm run test:unit
	docker compose run --rm server npm run test

.PHONY: test-server
test-server: test-setup
	docker compose run --rm server npm run test $(tests)

.PHONY: deploy
deploy: build
	docker compose up -d 

.PHONY: buildprod
buildprod: docker-compose.yml
	docker compose run --rm client npm run build
	docker compose run --rm server npm run build

.PHONY: docker-clean
docker-clean:
	docker volume prune -a -f
	docker compose down
	docker compose build --pull --no-cache

.PHONY: clean
clean:
	rm -f server/.env # any other generated resources? SHARED_CONFIG_PATH?

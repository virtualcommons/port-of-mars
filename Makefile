include config.mk

DB_USER=marsmadness
TEST_DB_NAME=pom_testing
DB_DATA_PATH=docker/data
DB_PASSWORD_PATH=keys/pom_db_password
JWT_SECRET_PATH=keys/jwt
ORMCONFIG_PATH=keys/ormconfig.json
PGPASS_PATH=keys/.pgpass
SENTRY_DSN_PATH=keys/sentry_dsn
MAIL_API_KEY_PATH=keys/mail_api_key
SECRETS=$(MAIL_API_KEY_PATH) $(DB_PASSWORD_PATH) $(JWT_SECRET_PATH) $(ORMCONFIG_PATH) $(PGPASS_PATH) $(SENTRY_DSN_PATH)

.PHONY: build
build: docker-compose.yml
	docker-compose pull db
	docker-compose build --pull

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

keys:
	mkdir -p keys

$(DB_PASSWORD_PATH): keys
	DB_PASSWORD=$$(head /dev/urandom | tr -dc '[:alnum:]' | head -c42); \
	TODAY=$$(date +%Y-%m-%d-%H:%M:%S); \
	if [ -f $(DB_PASSWORD_PATH) ]; \
	then \
	  cp "$(DB_PASSWORD_PATH)" "$(DB_PASSWORD_PATH)_$$TODAY"; \
	fi; \
	echo "$${DB_PASSWORD}" > $(DB_PASSWORD_PATH)

$(JWT_SECRET_PATH): keys
	JWT_SECRET=$$(head /dev/urandom | tr -dc '[:alnum:]' | head -c42); \
	echo $${JWT_SECRET} > $(JWT_SECRET_PATH)

$(ORMCONFIG_PATH): server/ormconfig.template.json $(DB_PASSWORD_PATH) keys
	DB_PASSWORD=$$(cat $(DB_PASSWORD_PATH)); \
	sed "s|DB_PASSWORD|$$DB_PASSWORD|g" server/ormconfig.template.json > $(ORMCONFIG_PATH)
	
$(PGPASS_PATH): $(DB_PASSWORD_PATH) server/deploy/pgpass.template keys
	DB_PASSWORD=$$(cat $(DB_PASSWORD_PATH)); \
	sed "s|DB_PASSWORD|$$DB_PASSWORD|g" server/deploy/pgpass.template > $(PGPASS_PATH)
	chmod 0600 $(PGPASS_PATH)

$(MAIL_API_KEY_PATH): keys
	touch "$(MAIL_API_KEY_PATH)"

$(SENTRY_DSN_PATH): keys
	touch "$(SENTRY_DSN_PATH)"

$(DB_DATA_PATH):
	mkdir -p "$(DB_DATA_PATH)"

.PHONY: secrets
secrets: $(SECRETS)

docker-compose.yml: base.yml staging.base.yml $(ENVIR).yml config.mk $(DB_DATA_PATH)
	case "$(ENVIR)" in \
	  dev) docker-compose -f base.yml -f "$(ENVIR).yml" config > docker-compose.yml;; \
	  staging|prod) docker-compose -f base.yml -f staging.base.yml -f "$(ENVIR).yml" config > docker-compose.yml;; \
	  *) echo "invalid environment. must be either dev, staging or prod" 1>&2; exit 1;; \
	esac

.PHONY: test-setup
test-setup: docker-compose.yml
	docker-compose run --rm server bash -c "dropdb --if-exists -h db -U ${DB_USER} ${TEST_DB_NAME} && createdb -h db -U ${DB_USER} ${TEST_DB_NAME} && yarn typeorm schema:sync -c test"

.PHONY: test
test: docker-compose.yml
	docker-compose run --rm client yarn test:unit
	docker-compose run --rm server yarn test

.PHONY: deploy
deploy: docker-compose.yml
	docker-compose pull db redis
	docker-compose build --pull
	docker-compose up -d 

.PHONY: buildprod
buildprod: docker-compose.yml
	docker-compose run --rm client yarn build
	docker-compose run --rm server yarn build

.PHONY: clean
clean:
	docker-compose run --rm server dropdb -h db -U ${DB_USER} ${TEST_DB_NAME}

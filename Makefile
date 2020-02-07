include config.mk

DB_PASSWORD_PATH=keys/pom_db_password
JWT_SECRET_PATH=keys/jwt
ORMCONFIG_PATH=keys/ormconfig.json
PGPASS_PATH=keys/.pgpass
SENTRY_DSN_PATH=keys/sentry_dsn
SECRETS=$(DB_PASSWORD_PATH) $(JWT_SECRET_PATH) $(ORMCONFIG_PATH) $(PGPASS_PATH) $(SENTRY_DSN_PATH)

.PHONY: build
build: docker-compose.yml $(SECRETS)
	docker-compose pull db
	docker-compose build --pull

keys:
	mkdir -p keys

$(DB_PASSWORD_PATH): keys
	DB_PASSWORD=$$(head /dev/urandom | tr -dc '[:alnum:]' | head -c42); \
	TODAY=$$(date +%Y-%m-%d-%H:%M:%S); \
	if [[ -f $(DB_PASSWORD_PATH) ]]; \
	then \
	  cp "$(DB_PASSWORD_PATH)" "$(DB_PASSWORD_PATH)_$$TODAY"; \
	fi; \
	echo $${DB_PASSWORD} > $(DB_PASSWORD_PATH)

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

$(SENTRY_DSN_PATH): keys
	touch "$(SENTRY_DSN_PATH)"

.PHONY: secrets
secrets: $(SECRETS)

docker-compose.yml: base.yml $(ENVIR).yml config.mk
	case "$(ENVIR)" in \
	  dev|staging) docker-compose -f base.yml -f "$(ENVIR).yml" config > docker-compose.yml;; \
	  prod) docker-compose -f base.yml -f staging.yml -f prod.yml config > docker-compose.yml;; \
	  *) echo "invalid environment. must be either dev, staging or prod" 1>&2; exit 1;; \
	esac

.PHONY: test
test: docker-compose.yml
	docker-compose run --rm client yarn test:unit
	docker-compose run --rm server yarn test

.PHONY: deploy
deploy: docker-compose.yml
	docker-compose up -d

.PHONY: buildprod
buildprod: docker-compose.yml
	docker-compose run --rm client yarn build
	docker-compose run --rm server yarn build

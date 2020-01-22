include config.mk

SECRETS=server/deploy/.secrets
DB_PASSWORD_PATH=server/deploy/pom_db_password

.PHONY: build
build: docker-compose.yml $(SECRETS)
	docker-compose pull db
	docker-compose build --pull

.ONESHELL:
$(DB_PASSWORD_PATH):
	DB_PASSWORD=$$(head /dev/urandom | tr -dc '[:alnum:]' | head -c42)
	TODAY=$$(date +%Y-%m-%d-%H:%M:%S)
	if [[ -f $(DB_PASSWORD_PATH) ]]; then
	  cp "$(DB_PASSWORD_PATH)" "$DB_PASSWORD_PATH_$$TODAY"
	fi
	echo $${DB_PASSWORD} > $(DB_PASSWORD_PATH)

.ONESHELL:
server/ormconfig.json: server/ormconfig.template.json $(DB_PASSWORD_PATH)
	DB_PASSWORD=$$(cat $(DB_PASSWORD_PATH))
	sed "s|DB_PASSWORD|$$DB_PASSWORD|g" server/ormconfig.template.json > server/ormconfig.json

.ONESHELL:
server/deploy/.pgpass: $(DB_PASSWORD_PATH) server/deploy/pgpass.template
	DB_PASSWORD=$$(cat $(DB_PASSWORD_PATH))
	sed "s|DB_PASSWORD|$$DB_PASSWORD|g" server/deploy/pgpass.template > server/deploy/.pgpass

$(SECRETS): $(DB_PASSWORD_PATH) server/ormconfig.json server/deploy/.pgpass
	touch $(SECRETS)

docker-compose.yml: $(ENVIR).yml
	case "$(ENVIR)" in
	  dev|staging) docker-compose -f base.yml -f "$(ENVIR).yml" config > docker-compose.yml;;
	  prod) docker-compose -f base.yml -f staging.yml -f prod.yml config > docker-compose.yml;;
	  *) echo "invalid environment. must be either dev, staging or prod" 1>&2; exit 1;;
	esac

.PHONY: test
test: docker-compose.yml
	docker-compose run --rm client yarn test:unit

.PHONY: deploy
deploy: docker-compose.yml
	docker-compose up -d

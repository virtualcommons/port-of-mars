# port-of-mars

[![Build Status](https://travis-ci.com/virtualcommons/port-of-mars.svg?token=Axd1f7q98op1tRxrKi92&branch=master)](https://travis-ci.com/virtualcommons/port-of-mars)

## About

[Port of Mars](https://interplanetary.asu.edu/port-of-mars) is an interdisciplinary research project sponsored by [Arizona State University's](https://www.asu.edu) [Interplanetary Initiative](https://interplanetary.asu.edu/). Its original incarnation was designed and implemented as a physical card game for 5 players. We are now a developing digital version of the Port of Mars card game to serve as a scalable research testbed for studying collective action.

If you'd like to get involved, please [let us know!](https://complexity.asu.edu/contact)

## Build the Codebase

### Development Setup

To create a development environment for your client and server run

```bash
./configure dev
make secrets
make
```

This creates secrets for the database, creates a `docker-compose.yml` file and builds the `client` and `server` docker images.

Now run

```
docker-compose up -d
```

and you should have a working development environment.

In order to login fixtures for the project need to be loaded. This can be done with

```
docker-compose exec server bash
yarn load-fixtures
```

Since the project hasn't been released yet there are no DB migrations. If a schema change occurs then
you can update the schema of your development DB with `yarn typeorm schema:sync`. If that doesn't work
it's best to start from scratch

```
yarn typeorm schema:drop
yarn typeorm schema:sync
yarn load-fixtures
```

Now you should be able to login using the usernames in the `fixtures/User.yml` file.

Tests for the project must be setup before they are run. Be sure to run

```
make test-setup
```

before trying to run and tests.

Tests for the project can be run with

```
make test
```

You should be able to go to a game instance by logging in as 'bob' on the login page. You should be taken to a game instance.

If you just want to update the `docker-compose.yml` you can run `make docker-compose.yml`.

### Staging Setup

```bash
./configure staging
make secrets
make
docker-compose up -d
```

### Production Setup

Copy the Sentry DSN url into `keys/sentry_dsn`. Then 

```bash
./configure prod
make secrets
make
docker-compose up -d
```

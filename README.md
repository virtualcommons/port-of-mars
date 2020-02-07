# port-of-mars

[![Build Status](https://travis-ci.com/virtualcommons/port-of-mars.svg?token=Axd1f7q98op1tRxrKi92&branch=master)](https://travis-ci.com/virtualcommons/port-of-mars)

## Setup

### Development Setup

To create a development environment for your client and server run

```bash
./configure dev
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

Tests for the project can be run with

```
make test
```

### Staging Setup

```bash
./configure staging
make
docker-compose up -d
```

### Production Setup

Copy the Sentry DSN url into `keys/sentry_dsn`. Then 

```bash
./configure prod
make
docker-compose up -d
```

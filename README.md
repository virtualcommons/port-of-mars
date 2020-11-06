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

and you should have a working development environment if your database was already setup.

In order to setup your database you'll need to run

```
docker-compose exec server bash
yarn typeorm schema:drop
yarn typeorm migration:run
```

Now you should be able to login into the website using the development login using any username you wish.

Tests for the project can be run with

```
make test
```

If you just want to update the `docker-compose.yml` you can run `make docker-compose.yml`.

To get `make browser` working you'll need to install an Firefox extension so that you open container tabs from the command line. See https://addons.mozilla.org/en-US/firefox/addon/open-url-in-container/


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

### Database Management

To extract the database to csv files run

```bash
./dump.sh dev # all games
./dump.sh dev --ids 1 2 4 6 # games matching ids
```

in a development environment or

```bash
./dump.sh prod # all games
./dump.sh prod --ids 1 2 4 6 # game matching ids
```

in a staging or production environment inside the server container. This will reproject the game events and summary csv files outlining the state of the game for every game event as well as export game, player and tounnament data. The csv files will be in the `docker/dump` folder. You can pack the results into an archive with `zip -r <name-of-archive> docker/dump/processed`

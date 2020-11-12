# port-of-mars

[![Build Status](https://travis-ci.com/virtualcommons/port-of-mars.svg?token=Axd1f7q98op1tRxrKi92&branch=master)](https://travis-ci.com/virtualcommons/port-of-mars)

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-4-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END --> 

## About

[Port of Mars](https://interplanetary.asu.edu/port-of-mars) is an interdisciplinary research project sponsored by [Arizona State University's](https://www.asu.edu) [Interplanetary Initiative](https://interplanetary.asu.edu/). Its original incarnation was designed and implemented as a physical card game for 5 players. We are now a developing digital version of the Port of Mars card game to serve as a scalable research testbed for studying collective action.

If you'd like to get involved, please [let us know!](https://complexity.asu.edu/contact)

## Build the Codebase

### Development Setup

These instructions are intended for Linux / MacOS (less tested on MacOS; please submit an issue or PR if you encounter any problems) and assume you have recent versions of [Docker](https://docs.docker.com/engine/install/#server) and [Docker Compose](https://docs.docker.com/compose/install/) installed on your system (you may also need to install [make](https://www.gnu.org/software/make/)).

To set up a development environment that starts a hot-reloading client and server, run:

```bash
% ./configure dev
% make secrets # create secrets for the database
% make         # create a new docker-compose.yml and build client and server docker images
```

If this completes successfully you will be able to bring up all necessary services (client, server, database, redis) by running

```
% docker-compose up -d
```

### Initialize the database

If you are starting from scratch you will need to initialize the database and load in the schema as well as fixture data for the Port of Mars tutorial quiz + questions.

```
% docker-compose exec server bash # open a bash shell in the server container
% yarn typeorm schema:drop        # drop the existing port of mars database schema if it exists
% yarn typeorm migration:run      # reload the port of mars database schema and apply all defined typeorm migrations in server/src/migration
% yarn load-fixtures
```

At this point you should be able to access the client by going to `http://localhost:8081` in your browser.

### Test Suite

Server tests: https://github.com/virtualcommons/port-of-mars/tree/master/server/tests

Client tests: https://github.com/virtualcommons/port-of-mars/tree/master/client/tests

Run the tests via 

```
% make test
```

### Additional make targets

` make docker-compose.yml` generates the `docker-compose.yml` from templates and should be re-run to apply any changes in these templates.

`make browser` requires the `open-url-in-container` Firefox extension: https://addons.mozilla.org/en-US/firefox/addon/open-url-in-container/


### Staging Setup

```bash
% ./configure staging
% make deploy
```

### Production Setup

Copy the Sentry DSN url into `keys/sentry_dsn`. Then 

```bash
% ./configure prod
% make deploy
```

### Data Export

In development, data can be exported from the database by running:

```bash
% ./dump.sh dev # all games
% ./dump.sh dev --ids 1 2 4 6 # games matching ids
```

In staging or production, change `dev` to `prod`:

```bash
% ./dump.sh prod # all games
% ./dump.sh prod --ids 1 2 4 6 # game matching ids
```

This generates CSV files with every persisted game event as well as summary csv files with game, player and tournament data. The csv files will be in the `docker/dump` folder. You can pack the results into an archive with `zip -r <name-of-archive> docker/dump/processed`.

## Contributors

Thanks to all the contributors to this project - [emoji key](https://allcontributors.org/docs/en/emoji-key)
<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/cpritcha"><img src="https://avatars0.githubusercontent.com/u/4530298?v=4" width="100px;" alt=""/><br /><sub><b>cpritcha</b></sub></a><br /><a href="https://github.com/virtualcommons/port-of-mars/issues?q=author%3Acpritcha" title="Bug reports">🐛</a> <a href="https://github.com/virtualcommons/port-of-mars/commits?author=cpritcha" title="Code">💻</a> <a href="https://github.com/virtualcommons/port-of-mars/commits?author=cpritcha" title="Documentation">📖</a> <a href="#maintenance-cpritcha" title="Maintenance">🚧</a> <a href="https://github.com/virtualcommons/port-of-mars/commits?author=cpritcha" title="Tests">⚠️</a> <a href="https://github.com/virtualcommons/port-of-mars/pulls?q=is%3Apr+reviewed-by%3Acpritcha" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://www.linkedin.com/in/chrstngyn/"><img src="https://avatars0.githubusercontent.com/u/8737685?v=4" width="100px;" alt=""/><br /><sub><b>Christine Nguyễn</b></sub></a><br /><a href="https://github.com/virtualcommons/port-of-mars/issues?q=author%3Achrstngyn" title="Bug reports">🐛</a> <a href="https://github.com/virtualcommons/port-of-mars/commits?author=chrstngyn" title="Code">💻</a> <a href="https://github.com/virtualcommons/port-of-mars/commits?author=chrstngyn" title="Documentation">📖</a> <a href="https://github.com/virtualcommons/port-of-mars/commits?author=chrstngyn" title="Tests">⚠️</a> <a href="#design-chrstngyn" title="Design">🎨</a> <a href="https://github.com/virtualcommons/port-of-mars/pulls?q=is%3Apr+reviewed-by%3Achrstngyn" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="http://adelerium.dev"><img src="https://avatars2.githubusercontent.com/u/43051098?v=4" width="100px;" alt=""/><br /><sub><b>Lorenzo Faivre</b></sub></a><br /><a href="https://github.com/virtualcommons/port-of-mars/commits?author=lfaivre" title="Code">💻</a> <a href="https://github.com/virtualcommons/port-of-mars/commits?author=lfaivre" title="Documentation">📖</a> <a href="#design-lfaivre" title="Design">🎨</a></td>
    <td align="center"><a href="https://poulden.com"><img src="https://avatars0.githubusercontent.com/u/939?v=4" width="100px;" alt=""/><br /><sub><b>Nick Poulden</b></sub></a><br /><a href="https://github.com/virtualcommons/port-of-mars/commits?author=nick" title="Code">💻</a> <a href="https://github.com/virtualcommons/port-of-mars/commits?author=nick" title="Documentation">📖</a> <a href="#design-nick" title="Design">🎨</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

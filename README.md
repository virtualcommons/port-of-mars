# port-of-mars

[![Build/Test Docker Image CI](https://github.com/virtualcommons/port-of-mars/actions/workflows/docker-ci.yml/badge.svg)](https://github.com/virtualcommons/port-of-mars/actions/workflows/docker-ci.yml) <!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-9-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END --> 

[![](https://dcbadge.vercel.app/api/server/AFEtAJZfEM)](https://discord.gg/AFEtAJZfEM)


## About

[Port of Mars](https://interplanetary.asu.edu/port-of-mars) is an interdisciplinary research project sponsored by [Arizona State University's](https://www.asu.edu) [Interplanetary Initiative](https://interplanetary.asu.edu/). Its original incarnation was designed and implemented as a physical card game for 5 players. We are developing a digital version of the Port of Mars game to serve as a scalable research testbed for studying collective action.

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

If this completes successfully you will be able to bring up all necessary services (client, server, database, redis) with `docker-compose up -d`

### Initialize the database

If you are starting from scratch you will need to initialize the database and initialize the schema and then load data fixtures into the database for the Port of Mars tutorial quiz questions.

```
% docker-compose exec server bash # open a bash shell into the server container
% yarn typeorm schema:drop        # DESTRUCTIVE OPERATION, be careful with this! Drops the existing port of mars database if it exists
% yarn typeorm migration:run      # initialize the port of mars database schema and apply all defined typeorm migrations in server/src/migration
% yarn load-fixtures              # load data fixtures into the database
```

At this point you should be able to test the Port of Mars by visiting `http://localhost:8081` in your browser.

### Create / Display / Run database migrations

For more info on typeorm data migrations see https://orkhan.gitbook.io/typeorm/docs/migrations

#### Create a data migration

```
% yarn typeorm migration:create -n NameOfMigration
```

This will create a new file prefixed by a timestamp, add the custom logic in the `up` and `down` methods.

#### Display or run data migrations

To display or run database migrations (for schema changes etc.) use `yarn typeorm` commands e.g., `migration:show` and `migration:run`

Example:

```
% yarn typeorm migration:show # shows all available migrations and any pending ones
yarn run v1.22.5                                                                                                   
$ ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:show                                  
query: SELECT * FROM "information_schema"."tables" WHERE "table_schema" = current_schema() AND "table_name" = 'migrations'
query: SELECT * FROM "migrations" "migrations"  ORDER BY "id" DESC
 [X] Initial1600968396723              
 [ ] UserMetadataAddition1607117297405
% yarn typeorm migration:run                          
yarn run v1.22.5                                                                                                   
$ ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run
query: SELECT * FROM "information_schema"."tables" WHERE "table_schema" = current_schema() AND "table_name" = 'migrations'
query: SELECT * FROM "migrations" "migrations"  ORDER BY "id" DESC
1 migrations are already loaded in the database.                                                                                                                                                                                       
2 migrations were found in the source code.
Initial1600968396723 is the last executed migration. It was executed on Thu Sep 24 2020 17:26:36 GMT+0000 (Coordinated Universal Time).
1 migrations are new migrations that needs to be executed.
query: START TRANSACTION
query: ALTER TABLE "user" ADD "isActive" boolean NOT NULL DEFAULT true
query: ALTER TABLE "user" ADD "dateCreated" TIMESTAMP NOT NULL DEFAULT now()
query: INSERT INTO "migrations"("timestamp", "name") VALUES ($1, $2) -- PARAMETERS: [1607117297405,"UserMetadataAddition1607117297405"]
Migration UserMetadataAddition1607117297405 has been executed successfully.
query: COMMIT
Done in 1.75s.
```


### Test Suite

Server tests: https://github.com/virtualcommons/port-of-mars/tree/master/server/tests

Client tests: https://github.com/virtualcommons/port-of-mars/tree/master/client/tests

You can run all of the tests via

```
% make test
```

### Additional make targets

` make docker-compose.yml` generates the `docker-compose.yml` from templates and can be re-run to apply any changes in these templates.

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

Data can be exported from the database with the `dump.sh` script and pass in the required `tournamentRoundId` parameter and optional game ids `gids` (numbers separated by spaces). 

Example:

```bash
% ./dump.sh dev --tournamentRoundId <id> # the tournament round to export
% ./dump.sh dev --tournamentRoundId <id> --gids 1 5 9 15 # also filter by specific games for the given tournament round
```

__Production__

In staging / production, change `dev` to `prod`:

```bash
% ./dump.sh prod --tournamentRoundId 11 # dump all games for tournament round 11
```

This generates CSV files with every persisted game event as well as summary csv files with game, player and tournament data. The csv files will be in the `docker/dump` folder.

## Contributors

Thanks to all the contributors to this project! [emoji key](https://allcontributors.org/docs/en/emoji-key)

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center"><a href="https://github.com/cpritcha"><img src="https://avatars0.githubusercontent.com/u/4530298?v=4?s=100" width="100px;" alt="cpritcha"/><br /><sub><b>cpritcha</b></sub></a><br /><a href="https://github.com/virtualcommons/port-of-mars/issues?q=author%3Acpritcha" title="Bug reports">🐛</a> <a href="https://github.com/virtualcommons/port-of-mars/commits?author=cpritcha" title="Code">💻</a> <a href="https://github.com/virtualcommons/port-of-mars/commits?author=cpritcha" title="Documentation">📖</a> <a href="#maintenance-cpritcha" title="Maintenance">🚧</a> <a href="https://github.com/virtualcommons/port-of-mars/commits?author=cpritcha" title="Tests">⚠️</a> <a href="https://github.com/virtualcommons/port-of-mars/pulls?q=is%3Apr+reviewed-by%3Acpritcha" title="Reviewed Pull Requests">👀</a></td>
      <td align="center"><a href="https://www.linkedin.com/in/chrstngyn/"><img src="https://avatars0.githubusercontent.com/u/8737685?v=4?s=100" width="100px;" alt="Christine Nguyễn"/><br /><sub><b>Christine Nguyễn</b></sub></a><br /><a href="https://github.com/virtualcommons/port-of-mars/issues?q=author%3Achrstngyn" title="Bug reports">🐛</a> <a href="https://github.com/virtualcommons/port-of-mars/commits?author=chrstngyn" title="Code">💻</a> <a href="https://github.com/virtualcommons/port-of-mars/commits?author=chrstngyn" title="Documentation">📖</a> <a href="https://github.com/virtualcommons/port-of-mars/commits?author=chrstngyn" title="Tests">⚠️</a> <a href="#design-chrstngyn" title="Design">🎨</a> <a href="https://github.com/virtualcommons/port-of-mars/pulls?q=is%3Apr+reviewed-by%3Achrstngyn" title="Reviewed Pull Requests">👀</a></td>
      <td align="center"><a href="http://adelerium.dev"><img src="https://avatars2.githubusercontent.com/u/43051098?v=4?s=100" width="100px;" alt="Lorenzo Faivre"/><br /><sub><b>Lorenzo Faivre</b></sub></a><br /><a href="https://github.com/virtualcommons/port-of-mars/commits?author=lfaivre" title="Code">💻</a> <a href="https://github.com/virtualcommons/port-of-mars/commits?author=lfaivre" title="Documentation">📖</a> <a href="#design-lfaivre" title="Design">🎨</a></td>
      <td align="center"><a href="http://nmoran.com"><img src="https://avatars0.githubusercontent.com/u/31869062?v=4?s=100" width="100px;" alt="Nick Moran"/><br /><sub><b>Nick Moran</b></sub></a><br /><a href="https://github.com/virtualcommons/port-of-mars/commits?author=nick-moran" title="Code">💻</a> <a href="https://github.com/virtualcommons/port-of-mars/commits?author=nick-moran" title="Documentation">📖</a> <a href="#design-nick-moran" title="Design">🎨</a></td>
      <td align="center"><a href="https://complexity.asu.edu"><img src="https://avatars0.githubusercontent.com/u/22534?v=4?s=100" width="100px;" alt="A Lee"/><br /><sub><b>A Lee</b></sub></a><br /><a href="https://github.com/virtualcommons/port-of-mars/issues?q=author%3Aalee" title="Bug reports">🐛</a> <a href="https://github.com/virtualcommons/port-of-mars/commits?author=alee" title="Code">💻</a> <a href="#maintenance-alee" title="Maintenance">🚧</a> <a href="https://github.com/virtualcommons/port-of-mars/pulls?q=is%3Apr+reviewed-by%3Aalee" title="Reviewed Pull Requests">👀</a> <a href="#projectManagement-alee" title="Project Management">📆</a></td>
      <td align="center"><a href="https://github.com/connor4410"><img src="https://avatars2.githubusercontent.com/u/65049616?v=4?s=100" width="100px;" alt="connor4410"/><br /><sub><b>connor4410</b></sub></a><br /><a href="https://github.com/virtualcommons/port-of-mars/issues?q=author%3Aconnor4410" title="Bug reports">🐛</a> <a href="#userTesting-connor4410" title="User Testing">📓</a></td>
      <td align="center"><a href="https://github.com/tsommer2"><img src="https://avatars0.githubusercontent.com/u/65748677?v=4?s=100" width="100px;" alt="tsommer2"/><br /><sub><b>tsommer2</b></sub></a><br /><a href="https://github.com/virtualcommons/port-of-mars/issues?q=author%3Atsommer2" title="Bug reports">🐛</a> <a href="#userTesting-tsommer2" title="User Testing">📓</a></td>
    </tr>
    <tr>
      <td align="center"><a href="http://colyseus.io"><img src="https://avatars3.githubusercontent.com/u/130494?v=4?s=100" width="100px;" alt="Endel Dreyer"/><br /><sub><b>Endel Dreyer</b></sub></a><br /><a href="https://github.com/virtualcommons/port-of-mars/commits?author=endel" title="Code">💻</a></td>
      <td align="center"><a href="https://github.com/sgfost"><img src="https://avatars.githubusercontent.com/u/46429375?v=4?s=100" width="100px;" alt="sgfost"/><br /><sub><b>sgfost</b></sub></a><br /><a href="https://github.com/virtualcommons/port-of-mars/commits?author=sgfost" title="Code">💻</a> <a href="#design-sgfost" title="Design">🎨</a> <a href="https://github.com/virtualcommons/port-of-mars/commits?author=sgfost" title="Tests">⚠️</a> <a href="https://github.com/virtualcommons/port-of-mars/commits?author=sgfost" title="Documentation">📖</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

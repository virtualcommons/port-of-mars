#!/bin/sh

CLI_CMD="${1:-cli}"

## create indefinite freeplay tournament round

npm run ${CLI_CMD} -- tournament create --tournamentName="freeplay"
npm run ${CLI_CMD} -- tournament round create --open --numberOfGameRounds=10

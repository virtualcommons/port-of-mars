#!/bin/sh

CLI_CMD="${1:-cli}"

## create indefinite freeplay tournament round

yarn ${CLI_CMD} tournament create --tournamentName="freeplay"
yarn ${CLI_CMD} tournament round create --open --numberOfGameRounds=10

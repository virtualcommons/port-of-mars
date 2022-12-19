#!/bin/sh

CLI_CMD="${1:-cli}"

## create indefinite open tournament round

yarn ${CLI_CMD} tournament create --tournamentName="openbeta"
yarn ${CLI_CMD} tournament round create --open --numberOfGameRounds=10

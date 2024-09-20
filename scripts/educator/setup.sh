#!/bin/bash

CLI_CMD="${1:-cli}" # in prod change to cli:prod e.g., `./setup.sh cli:prod`

## create educator mode tournament

npm run ${CLI_CMD} -- tournament create --tournamentName="educator"
npm run ${CLI_CMD} -- tournament round create --numberOfGameRounds=10

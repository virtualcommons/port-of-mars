#!/bin/bash

CLI_CMD="${1:-cli}" # in prod change to cli:prod e.g., `./setup.sh cli:prod`

## create Fall 2023 Mars Madness tournament + Round 1 structure

yarn ${CLI_CMD} tournament create --tournamentName="2023-11 Mars Madness" --description="The next Mars Madness tournament begins November 10, 2023! Top-scoring players on surviving teams will advance to the next round. Players who make it to the championship round will receive a tabletop game version of Port of Mars, and the winner of the championship will receive a top prize of \$1000 USD!"
yarn ${CLI_CMD} tournament round create --introSurveyUrl=https://asu.co1.qualtrics.com/jfe/form/SV_0c8tCMZkAUh4V8x --exitSurveyUrl=https://asu.co1.qualtrics.com/jfe/form/SV_6FNhPbsBuybTjEN --announcement="REGISTRATION FOR ROUND 1 IS NOW OPEN. Register, complete the Port of Mars Mission Control onboarding, and sign in during a scheduled launch time to compete in the next Mars Madness tournament!"
# set up 3 launch dates per day from 2023-11-10 to 2023-11-16
for day in 10 11 12 13 14 15 16; do
    yarn ${CLI_CMD} tournament round date --date="2023-11-${day}T12:00:00-07:00";
    yarn ${CLI_CMD} tournament round date --date="2023-11-${day}T15:00:00-07:00";
    yarn ${CLI_CMD} tournament round date --date="2023-11-${day}T19:00:00-07:00";
done
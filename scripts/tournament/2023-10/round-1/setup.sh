#!/bin/bash

CLI_CMD="${1:-cli}" # in prod change to cli:prod e.g., `./setup.sh cli:prod`

## create Fall 2023 Mars Madness tournament + Round 1 structure

yarn ${CLI_CMD} tournament create --tournamentName="2023-11 Mars Madness" --description="The next Mars Madness Port of Mars tournament begins on November 10, 2023! Sign up now for a chance to win \$1000 USD or the new board game version of Port of Mars. Top-scoring players on surviving teams will advance to the next round and eventually a single game championship round, with a top prize of \$1000 USD for the championship game winner. Players who qualify for the championship round will receive a brand new tabletop game version of Port of Mars (available for sale to the public soon)."
yarn ${CLI_CMD} tournament round create --introSurveyUrl=https://asu.co1.qualtrics.com/jfe/form/SV_0c8tCMZkAUh4V8x --exitSurveyUrl=https://asu.co1.qualtrics.com/jfe/form/SV_6FNhPbsBuybTjEN --announcement="ROUND 1 IS NOW OPEN. Register, complete the Port of Mars Mission Control onboarding, and sign in during a scheduled launch time to compete in the next Mars Madness tournament!"
# set up 3 launch dates per day from 2023-11-10 to 2023-11-16
for day in 10 11 12 13 14 15 16; do
    yarn ${CLI_CMD} tournament round date --date="2023-11-${day}T12:00:00-07:00";
    yarn ${CLI_CMD} tournament round date --date="2023-11-${day}T15:00:00-07:00";
    yarn ${CLI_CMD} tournament round date --date="2023-11-${day}T19:00:00-07:00";
done
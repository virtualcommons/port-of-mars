#!/bin/bash

CLI_CMD="${1:-cli}" # in prod change to cli:prod e.g., `./setup.sh cli:prod`

## create February 2024 Mars Madness tournament + Round 1 structure

npm run ${CLI_CMD} -- tournament create --tournamentName="2024-02 Mars Madness" --description="The next Mars Madness tournament begins February 8, 2024! Top-scoring players on surviving teams will advance to the next round. Players who make it to the championship round will receive a Port of Mars T-shirt, and the winner of the championship will receive the top prize of \$500 USD! Winners of surviving groups in the first round will also receive a \$10 Amazon gift card."
npm run ${CLI_CMD} -- tournament treatment add --treatmentIds 1 2 3
npm run ${CLI_CMD} -- tournament round create --introSurveyUrl=https://asu.co1.qualtrics.com/jfe/form/SV_0c8tCMZkAUh4V8x --exitSurveyUrl=https://asu.co1.qualtrics.com/jfe/form/SV_6FNhPbsBuybTjEN --announcement="REGISTRATION FOR ROUND 1 IS NOW OPEN. Register, complete the Port of Mars Mission Control onboarding, and sign in during a scheduled launch time to compete in the next Mars Madness tournament!"
# set up 3 launch dates per day from 2024-02-08 to 2024-02-21
for day in {08..21}; do
    npm run ${CLI_CMD} -- tournament round date --date="2024-02-${day}T17:00:00-07:00";
    npm run ${CLI_CMD} -- tournament round date --date="2024-02-${day}T20:00:00-07:00";
    npm run ${CLI_CMD} -- tournament round date --date="2024-02-${day}T22:00:00-07:00";
done

#!/bin/bash

CLI_CMD="${1:-cli}" # in prod invoke with `cli:prod` e.g., `$ ./setup.sh cli:prod`

## create Fall 2023 Mars Madness tournament Round 2 structure

npm run ${CLI_CMD} -- tournament round create --introSurveyUrl=https://asu.co1.qualtrics.com/jfe/form/SV_9N65NiZ7uJjxEIl --exitSurveyUrl=https://asu.co1.qualtrics.com/jfe/form/SV_6FNhPbsBuybTjEN --announcement="ROUND 2 IS NOW OPEN. Eligible players will be explicitly invited to participate via email, so keep an eye on those inboxes! If you've been sent an invitation, please sign in and complete all pre-mission onboarding tasks before joining the lobby during the scheduled launch time to compete."
# single launch time, Wednesday November 29th, 2023 at 8PM MST
npm run ${CLI_CMD} -- tournament round date --date="2023-11-29T20:00:00-07:00";

#!/bin/bash

CLI_CMD="${1:-cli}" # in prod invoke with `cli:prod` e.g., `$ ./setup.sh cli:prod`

## Fall 2023 Mars Madness tournament championship round

yarn ${CLI_CMD} tournament round create --introSurveyUrl=https://asu.co1.qualtrics.com/jfe/form/SV_9N65NiZ7uJjxEIl --exitSurveyUrl=https://asu.co1.qualtrics.com/jfe/form/SV_6FNhPbsBuybTjEN --announcement="WELCOME TO THE CHAMPIONSHIP ROUND! Eligible players have been explicitly invited to participate via email, so keep an eye on those inboxes! If you've been sent an invitation, please sign in and complete all pre-mission onboarding tasks before joining the lobby during the scheduled launch time to compete." --numberOfGameRounds 9
# single launch time, Thursday November 30th, 2023 at 8PM MST
yarn ${CLI_CMD} tournament round date --date="2023-11-30T20:00:00-07:00";

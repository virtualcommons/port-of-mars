#!/bin/sh


CLI_CMD="${1:-cli}"

## create 2022-02 Mars Madness tournament + Round 1 structure

npm run ${CLI_CMD} -- tournament create --tournamentName="2022-02 Mars Madness"
npm run ${CLI_CMD} -- tournament round create --introSurveyUrl=https://asu.co1.qualtrics.com/jfe/form/SV_0c8tCMZkAUh4 --exitSurveyUrl=https://asu.co1.qualtrics.com/jfe/form/SV_6FNhPbsBuybTjEN --announcement="ROUND 1 IS NOW OPEN. Register, complete your Port of Mars Mission Control onboarding, and sign in during a scheduled launch time to compete in the Mars Madness tournament!"
npm run ${CLI_CMD} -- tournament round date --date="2022-02-23T15:00:00-07:00"
npm run ${CLI_CMD} -- tournament round date --date="2022-02-23T19:00:00-07:00"
npm run ${CLI_CMD} -- tournament round date --date="2022-02-24T15:00:00-07:00"
npm run ${CLI_CMD} -- tournament round date --date="2022-02-24T19:00:00-07:00"
npm run ${CLI_CMD} -- tournament round date --date="2022-02-25T15:00:00-07:00"
npm run ${CLI_CMD} -- tournament round date --date="2022-02-25T19:00:00-07:00"
npm run ${CLI_CMD} -- tournament round date --date="2022-02-26T15:00:00-07:00"
npm run ${CLI_CMD} -- tournament round date --date="2022-02-26T19:00:00-07:00"
npm run ${CLI_CMD} -- tournament round date --date="2022-02-27T15:00:00-07:00"
npm run ${CLI_CMD} -- tournament round date --date="2022-02-27T19:00:00-07:00"

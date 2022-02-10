#!/bin/bash

yarn cli:prod tournament create --tournamentName="Mars Madness Fall 2020"
yarn cli:prod tournament round create --introSurveyUrl="https://asu.co1.qualtrics.com/jfe/form/SV_0c8tCMZkAUh4V8x" --exitSurveyUrl="https://asu.co1.qualtrics.com/jfe/form/SV_6FNhPbsBuybTjEN"
# create dates
yarn cli:prod tournament round date --date="2020-10-20T15:00:00-07:00"
yarn cli:prod tournament round date --date="2020-10-20T19:00:00-07:00"
yarn cli:prod tournament round date --date="2020-10-21T15:00:00-07:00"
yarn cli:prod tournament round date --date="2020-10-21T19:00:00-07:00"
yarn cli:prod tournament round date --date="2020-10-22T15:00:00-07:00"
yarn cli:prod tournament round date --date="2020-10-22T19:00:00-07:00"

# create explicit invitations (round 2 and beyond)
yarn cli:prod tournament round invite --tournamentRoundId=${TID} --participated --userIds 

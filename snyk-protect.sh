#!/bin/bash
if [ "$NODE_ENV" = "development" ]; then
  echo 'snyk patch disabled; pls run *npm run snyk-protect* manually'
else
  npm run snyk-protect
fi

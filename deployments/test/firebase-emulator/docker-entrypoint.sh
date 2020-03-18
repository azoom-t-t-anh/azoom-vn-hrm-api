#!/bin/bash

cd /usr/local/bengal-api
yarn install
yarn specs build

cd /usr/local/bengal-api/functions
yarn install

firebase setup:emulators:firestore
export FIRESTORE_EMULATOR_HOST=localhost:8080

env FIREBASE_EMULATOR=1 env NODE_ENV=test firebase emulators:start --project default

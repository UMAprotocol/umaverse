# How to run Cypress test

## Setup

- In order to run this test script, you need 3 terminals open running the following:

1) Umaverse app in localhost:3000 
2) Hardhat instance in localhost:8545. I use this repo setup, which has some scripts: (https://github.com/UMAprotocol/hardhat-test) 
3) Protocol API (https://github.com/UMAprotocol/protocol/tree/master/packages/api) and run yarn lsp_api. Note: The code for this is on a WIP branch as of Mon, Sept 20th. This also needs to be run *after* the hardhat instance is ran, as it attempts to connect to the chain. Give the API time to run through processes on initial load.
4) In your .env file, set this value to the following:

NEXT_PUBLIC_UMA_API_URL = http://localhost:8282

Once this is running, a 4th terminal needs to be run in the top of this app, with the following:

```sh
yarn cypress:open
```

## Selecting a test.

- This should open an app which will show you the tests available. Double click on the connect-wallet-kpi.js test.

- This will run this test.
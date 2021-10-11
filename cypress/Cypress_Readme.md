# How to run Cypress test

## Setup

- In order to run this test script, you need 3 terminals open running the following:

1) Umaverse app in localhost:3000 
2) Hardhat instance in localhost:8545. I use this repo setup, which has some scripts: (https://github.com/UMAprotocol/hardhat-test) 
3) Protocol API (https://github.com/UMAprotocol/protocol/tree/master/packages/api) and run yarn lsp_api. This also needs to be run *after* the hardhat instance is ran, as it attempts to connect to the chain. Give the API time to run through processes on initial load.
4) In your .env file, set this value to the following:
5) You will need to seed UMA to the test account by running the 0-seed-account.js test script.

NEXT_PUBLIC_UMA_API_URL = http://localhost:8282

Once this is running, a 4th terminal needs to be run in the top of this app, with the following:

```sh
yarn cypress:open
```

## Selecting a test.

- This should open an app which will show you the tests available. Double click on the chosen file to test.

- This will run this test.


## Running CI Test
CI Tests run cypress headlessly and starts up the API in process. You will need envs to configure the API, please
refer to the README for the lsp_api app for more information if you need it.


### CI API ENV variables

```
CUSTOM_NODE_URL=ws://localhost:8545
EXPRESS_PORT=8282
UPDATE_RATE_S=60
PRICE_UPDATE_RATE_S=3600
DETECT_CONTRACTS_UPDATE_RATE_S=5
cryptowatchApiKey=
tradermadeApiKey=
quandlApiKey=
defipulseApiKey=
zrxBaseUrl=https://api.0x.org
MULTI_CALL_2_ADDRESS=0x5ba1e12693dc8f9c48aad8770482f4739beed696
lspCreatorAddresses=0x9504b4ab8cd743b06074757d3B1bE3a3aF9cea10
```


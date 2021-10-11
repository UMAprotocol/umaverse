.PHONY: local-node
local-node: #Create a local fork from mainnet
	@docker run -d \
	trufflesuite/ganache-cli \
	ganache-cli --fork ${NODE_URL}

.PHONY: local-api
local-api: #Create a local UMA api environment
	@docker run -d \
	--env CUSTOM_NODE_URL=${CUSTOM_NODE_URL} \
	--env EXPRESS_PORT=${EXPRESS_PORT} \
	--env COMMAND="${COMMAND}" \
	--env UPDATE_BLOCKS=${UPDATE_BLOCKS} \
	--env backfillDays=${backfillDays} \
	--env UPDATE_RATE_S=${UPDATE_RATE_S} \
	--env DETECT_CONTRACTS_UPDATE_RATE_S=${DETECT_CONTRACTS_UPDATE_RATE_S} \
	--env zrxBaseUrl=${zrxBaseUrl} \
	--env cryptowatchApiKey=${cryptowatchApiKey} \
	--env tradermadeApiKey=${tradermadeApiKey} \
	--env quandlApiKey=${quandlApiKey} \
	--env defipulseApiKey=${defipulseApiKey} \
	--env MULTI_CALL_ADDRESS=${MULTI_CALL_ADDRESS} \
	--env lspCreatorAddresses=${lspCreatorAddresses} \
	--env MULTI_CALL_2_ADDRESS=${MULTI_CALL_2_ADDRESS} \
	    -p 8282:8282 \
	    gcr.io/uma-protocol/github.com/umaprotocol/protocol:latest

.PHONY: e2e-tests
e2e-tests: #Run cypress container
	docker run -it \
	--volume $(shell pwd):/umaverse \
	-w /umaverse \
	--entrypoint=cypress \
	cypress/included:3.2.0 \
	run

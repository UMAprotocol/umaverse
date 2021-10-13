protocol_docker_image=gcr.io/uma-protocol/github.com/umaprotocol/protocol:latest

.PHONY: node-local
node-local: #Create a local fork from mainnet
	@docker run -d \
	-p 8545:8545 \
	--env COMMAND="${COMMAND_NODE}" \
	--env NODE_OPTIONS="--max_old_space_size=4000" \
	--memory=4g \
	  $(protocol_docker_image)

.PHONY: api-status
api-status:
	@/bin/bash .circleci/check_api_status.sh

.PHONY: api-local
api-local: #Create a local UMA api environment
	@docker run -d \
	--network host \
	--env CUSTOM_NODE_URL=${CUSTOM_NODE_URL} \
	--env NEXT_PUBLIC_UMA_API_URL=${NEXT_PUBLIC_UMA_API_URL} \
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
	  $(protocol_docker_image)

.PHONY: e2e-tests
e2e-tests: #Run cypress container
	docker run -it \
	--volume $(shell pwd):/umaverse \
	-w /umaverse \
	--entrypoint=cypress \
	cypress/included:3.2.0 \
	run

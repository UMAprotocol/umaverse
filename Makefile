protocol_docker_image=gcr.io/uma-protocol/github.com/umaprotocol/protocol:latest
check_api_status=/umaverse/.circleci/check_api_status.sh
check_node_status=/umaverse/.circleci/check_node_status.sh

.PHONY: create-e2e-network
create-e2e-network: #Create a local container network for tests
	docker network create e2e-network

.PHONY: node-local
node-local: #Create a local fork from mainnet
	@docker run -d \
	--network e2e-network \
	--env COMMAND="${COMMAND_NODE}" \
	--env NODE_OPTIONS="--max_old_space_size=4000" \
	--memory=4g \
	  $(protocol_docker_image)

.PHONY: api-status
api-status:
	@docker run -it \
	--network e2e-network \
	--env COMMAND=$(check_api_status) \
	--volume $(shell pwd):/umaverse \
	  $(protocol_docker_image)

.PHONY: node-status
node-status:
	@docker run -it \
	--network e2e-network \
	--env COMMAND=$(check_node_status) \
	--volume $(shell pwd):/umaverse \
	  $(protocol_docker_image)

.PHONY: api-local
api-local: #Create a local UMA api environment
	@docker run -d \
	--network e2e-network \
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
	--env NODE_OPTIONS="--max_old_space_size=8000" \
	--memory=8g \
	  $(protocol_docker_image)

.PHONY: e2e-tests
e2e-tests: #Run cypress container
	docker run -it \
	--network e2e-network \
	--volume $(shell pwd):/umaverse \
	-w /umaverse \
	--entrypoint=cypress \
	cypress/included:3.2.0 \
	run

protocol_docker_image=gcr.io/uma-protocol/github.com/umaprotocol/protocol:latest
check_api_status=/umaverse/.circleci/check_api_status.sh
check_node_status=/umaverse/.circleci/check_node_status.sh
nvm_config=/home/circleci/umaverse/.circleci/nvm_config.sh
chrome_url=https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb

.PHONY: node-local
node-local: #Create a local fork from mainnet
	@docker run -d \
	--network host \
	--env COMMAND="${COMMAND_NODE}" \
	--env NODE_OPTIONS="--max_old_space_size=4000" \
	--memory=4g \
	  $(protocol_docker_image)

.PHONY: api-status
api-status:
	@docker run -it \
	--network host \
	--env COMMAND=$(check_api_status) \
	--volume $(shell pwd):/umaverse \
	  $(protocol_docker_image)

.PHONY: node-status
node-status:
	@docker run -it \
	--network host \
	--env COMMAND=$(check_node_status) \
	--volume $(shell pwd):/umaverse \
	  $(protocol_docker_image)

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
	--env NODE_OPTIONS="--max_old_space_size=8000" \
	--memory=8g \
	  $(protocol_docker_image)

.PHONY: e2e-dependencies
e2e-dependencies: #Run cypress container
	@cd /home/circleci/umaverse && \
	yarn && \
	yarn build && \
	yarn start && \
	sudo apt update && \
	sudo apt-get install \
	libgtk2.0-0 \
	libgtk-3-0 \
	libgbm-dev \
	libnotify-dev \
	libgconf-2-4 \
	libnss3 libxss1 \
	libasound2 \
	libxtst6 \
	xauth \
	xvfb

.PHONY: e2e-tests
e2e-tests: #Run cypress container
	cd /home/circleci/umaverse && \
	$(shell npm bin)/cypress run \
	--browser chrome

.PHONY: chrome-local
chrome-local: #Install headless chromium
	sudo apt-get install \
	libappindicator1 \
	fonts-liberation && \
  wget $(chrome_url) && \
  sudo dpkg -i google-chrome*.deb

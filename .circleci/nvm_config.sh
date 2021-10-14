#!/bin/bash

set -o errexit
set -o nounset

echo 'export NVM_DIR="/opt/circleci/.nvm"' >> $BASH_ENV
echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> $BASH_ENV

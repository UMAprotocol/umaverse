#!/bin/bash

set -o errexit
set -o nounset

echo "testing http response"

failureCode() {
    local url=${1:-http://localhost:8080}
    local code=${2:-500}
    local status=$(curl --head --location --connect-timeout 5 --write-out %{http_code} --silent --output /dev/null ${url})
    [[ $status == ${code} ]] || [[ $status == 000 ]]
}

until [ $? -gt 0 ]
 do
   failureCode http://localhost:8282 && echo "waiting for api..." || break
   sleep 10
done

echo "local API up!"

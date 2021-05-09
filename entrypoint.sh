#!/bin/sh

set -eu

if [ ! -z "${1:-}" ]; then
	exec "$@"
else

  VIRTUAL_HOST=${VIRTUAL_HOST:-"local.cortezaproject.org"}

  API_SCHEME=${API_SCHEME:-""}
  API_PREFIX=${API_PREFIX:-"api."}
  API_BASEURL=${API_BASEURL:-"${API_SCHEME}//${API_PREFIX}${VIRTUAL_HOST}"}

  echo "window.CortezaAPI = '${API_BASEURL}'" > ./config.js

  nginx -g "daemon off;"
fi

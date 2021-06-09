#!/usr/bin/env sh
set -eu

rm /app/dist/client/assets/data/keycloak.json
envsubst '${FINSEC_URL} ${KEYCLOAK_URL} ${DASHBOARD_BACKEND_URL}' < /etc/nginx/conf.d/default.conf.template >
/etc/nginx/conf.d/default.conf
envsubst '${CLIENT_SECRET}' < /etc/keycloak.template > /app/dist/client/assets/data/keycloak.json

exec "$@"

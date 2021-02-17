#!/bin/sh

export REACT_APP_NGINXPROXY

envsubst '${REACT_APP_NGINXPROXY}' < /etc/nginx/conf.d/nginx_container.conf.template > /etc/nginx/conf.d/nginx_container.conf

exec "$@"
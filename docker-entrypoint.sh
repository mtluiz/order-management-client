#!/bin/sh
set -e

INDEX_HTML=/usr/share/nginx/html/index.html

replace_env_variables() {

  env | grep "^VITE_" | while read -r line; do

    var_name=$(echo "$line" | cut -d '=' -f 1)
    var_value=$(echo "$line" | cut -d '=' -f 2-)
    
    search_for="__${var_name}__"
    echo "Replacing $search_for with $var_value"
    sed -i "s|$search_for|$var_value|g" "$INDEX_HTML"
  done
}

generate_runtime_config() {
  echo "window.env = {" > /usr/share/nginx/html/env-config.js
  env | grep "^VITE_" | while read -r line; do
    var_name=$(echo "$line" | cut -d '=' -f 1)
    var_value=$(echo "$line" | cut -d '=' -f 2-)
    echo "  $var_name: \"$var_value\"," >> /usr/share/nginx/html/env-config.js
  done
  echo "};" >> /usr/share/nginx/html/env-config.js
}

configure_nginx_for_spa() {
  if [ ! -f /etc/nginx/conf.d/default.conf.original ]; then
    cp /etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf.original
    
    cat > /etc/nginx/conf.d/default.conf << 'EOF'
server {
    listen       80;
    server_name  localhost;

    location / {
        root   /usr/share/nginx/html;
        index  index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    # Caching for static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        root /usr/share/nginx/html;
        expires 30d;
        add_header Cache-Control "public, max-age=2592000";
    }
    
    # Don't cache service worker
    location = /sw.js {
        root /usr/share/nginx/html;
        add_header Cache-Control "no-store, no-cache, must-revalidate";
    }

    # Error pages
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }
}
EOF
  fi
}

replace_env_variables
generate_runtime_config
configure_nginx_for_spa

exec "$@" 
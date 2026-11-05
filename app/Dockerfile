FROM nginx:alpine

# Copy static frontend assets to Nginx default document root
WORKDIR /usr/share/nginx/html
COPY src/ .

# Expose standard HTTP port
EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]

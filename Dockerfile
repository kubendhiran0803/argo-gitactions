FROM nginx:alpine

WORKDIR /usr/share/nginx/html

COPY index.html .
COPY style.css .
COPY app.js .

EXPOSE 80
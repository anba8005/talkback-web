FROM node:lts-alpine as builder

RUN mkdir /app

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

FROM eu.gcr.io/gyvaitv/nginx-brotli:latest as app

COPY --from=builder /app/build/ /usr/share/nginx/html

COPY nginx.vh.template /etc/nginx/conf.d/default.template

ENV KEEPALIVE_TIMEOUT=75
ENV KEEPALIVE_REQUESTS=100
ENV ACCESS_LOG="/var/log/nginx/access.log main"

CMD envsubst '$$ACCESS_LOG,$$KEEPALIVE_TIMEOUT,$$KEEPALIVE_REQUESTS' \
	< /etc/nginx/conf.d/default.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'

EXPOSE 80

# Giai đoạn build
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Giai đoạn production
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.template

# Khởi động với script để thay thế $PORT
RUN echo 'envsubst \$PORT < /etc/nginx/conf.d/default.template > /etc/nginx/conf.d/default.conf && nginx -g "daemon off;"' > /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE $PORT
CMD ["/docker-entrypoint.sh"]

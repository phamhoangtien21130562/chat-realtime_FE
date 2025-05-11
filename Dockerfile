# Step 1: Build app
FROM node:18-alpine as build
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm install
COPY . ./
RUN npm run build

# Step 2: Serve app using Nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
# Copy default nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

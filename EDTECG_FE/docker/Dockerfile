# Stage 1: Build the React app
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf

# Copy built files from the builder stage
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
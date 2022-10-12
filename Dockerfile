# ==== CONFIGURE =====
FROM node:16-alpine 
WORKDIR /app
COPY . .
# ==== BUILD =====
RUN npm ci 
RUN npm run build
# ==== RUN =======
ENV NODE_ENV production
EXPOSE 3000
# Start the app
CMD [ "npx", "serve", "build" ]
### Stage 1: install & build ###
FROM node:18-alpine AS builder
WORKDIR /app

# install deps
COPY package.json package-lock.json ./
RUN npm ci

# copy source & tsconfig, then compile
COPY tsconfig.json ./
COPY src/ ./src
COPY tests/ ./tests
COPY jest.config.js ./
RUN npm run build

### Stage 2: production image ###
FROM node:18-alpine AS prod
WORKDIR /app

# only copy the built output and prod deps
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package.json ./

ENV NODE_ENV=production
EXPOSE 3000

# run the compiled JS
CMD ["npm", "start"]

### Stage 3: test image ###
FROM node:18-alpine AS test
WORKDIR /app

# Copy everything needed for testing
COPY --from=builder /app /app

# Set test environment
ENV NODE_ENV=test
ENV CI=true

# Default command for running tests
CMD ["npm", "test"]

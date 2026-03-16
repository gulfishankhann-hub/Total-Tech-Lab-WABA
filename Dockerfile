FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Accept build arguments for Vite
ARG VITE_META_ACCESS_TOKEN
ARG VITE_META_PHONE_NUMBER_ID
ARG VITE_META_WABA_ID
ARG VITE_META_APP_ID

# Set them as environment variables for the build process
ENV VITE_META_ACCESS_TOKEN=$VITE_META_ACCESS_TOKEN
ENV VITE_META_PHONE_NUMBER_ID=$VITE_META_PHONE_NUMBER_ID
ENV VITE_META_WABA_ID=$VITE_META_WABA_ID
ENV VITE_META_APP_ID=$VITE_META_APP_ID

# Build the app
RUN npm run build

# Production image
FROM node:20-alpine

WORKDIR /app

# Install serve to run the static site
RUN npm install -g serve

# Copy built assets
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3000

# Start server
CMD ["serve", "-s", "dist", "-l", "3000"]

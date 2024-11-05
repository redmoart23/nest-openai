# Stage 1: Build the application
FROM node:20 AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --only=production
COPY . .

# Build the NestJS application
RUN npm run build

# Stage 2: Create the production image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy dependencies from the build stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Set environment variables
ENV NODE_ENV=production
EXPOSE 3000

# Run the application
CMD ["node", "dist/main"]

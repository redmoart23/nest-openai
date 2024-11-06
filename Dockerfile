# Use the official Node.js image as the base image
FROM node:20-alpine

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install the dependencies
RUN npm ci

# Copy the NestJS application code
COPY . .

# Build the NestJS application
RUN npm run build

# Expose the port that the NestJS application will run on
EXPOSE 3000

# Start the NestJS application
CMD ["npm", "run", "start:prod"]
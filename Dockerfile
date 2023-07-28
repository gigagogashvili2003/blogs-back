# Use the official Node.js LTS (Long Term Support) image as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files to the container
COPY . .

# Expose the port your NestJS app is listening on
EXPOSE 3000

# Command to start the application in watch mode
CMD ["npm", "run", "start:dev"]

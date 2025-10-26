# Use official Node.js image
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy package files first (for layer caching)
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application files
COPY . .

# Expose the port your app runs on (change if needed)
EXPOSE 3000
    
# Command to start your app
CMD ["node", "server.js"]

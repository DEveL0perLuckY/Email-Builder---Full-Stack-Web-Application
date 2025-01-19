# Use a stable Node.js version
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first (for efficient caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the frontend app
RUN npm run build

# Expose the port your app runs on
EXPOSE 3033

# Run the application
CMD ["npm", "run", "preview", "--", "--port", "3033"]
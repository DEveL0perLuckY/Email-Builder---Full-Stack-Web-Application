# Use the official Node.js image as the base image
FROM node:20
RUN apt-get update && apt-get install -y \
  libnss3 \
  libatk1.0-0 \
  libatk-bridge2.0-0 \
  libcups2 \
  libxcomposite1 \
  libxrandr2 \
  libgbm1 \
  libasound2 \
  libpangocairo-1.0-0 \
  libpango-1.0-0 \
  libgtk-3-0 \
  fonts-liberation \
  libx11-xcb1 \
  libxcb1 \
  libx11-6 \
  libxext6 \
  libxfixes3 \
  libxcursor1 \
  libxdamage1 \
  libxi6 \
  libxrender1 \
  libxss1 \
  libxtst6 \
  ca-certificates \
  fonts-ipafont \
  fonts-freefont-ttf \
  && rm -rf /var/lib/apt/lists/*

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the NestJS application
RUN npm run build

# Expose the application port
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/main"]
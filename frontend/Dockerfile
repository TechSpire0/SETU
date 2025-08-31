# Start from the correct Node.js version
FROM node:22.18.0-alpine

# Set the working directory for the application
WORKDIR /app

# Copy package.json and package-lock.json first to use Docker's cache
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy all other project files
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Start the development server using the 'dev' script
CMD ["npm", "run", "dev"]
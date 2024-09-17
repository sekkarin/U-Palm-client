# Use the official Node.js image.
ARG NODE_VERSION=21.5.0
FROM node:${NODE_VERSION}-alpine  as builder
# Set the working directory
WORKDIR /app

# Copy dependency files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js application
ENV NODE_ENV=production
RUN npm run build

# Install `serve` to serve the production build
# RUN npm install -g serve

# Start a new stage from a smaller image
FROM node:${NODE_VERSION}-alpine 

# Set the working directory
WORKDIR /app

# Copy the production build from the builder stage
COPY --from=builder /app ./

# Expose the port
EXPOSE 3001

# Start the application
# CMD ["serve", "-s", "out", "-l", "3001"]
CMD ["npm","start"]

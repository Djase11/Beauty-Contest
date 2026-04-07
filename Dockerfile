FROM node:18-alpine

WORKDIR /app

# Copy root package files
COPY package*.json ./

# Install root dependencies
RUN npm install

# Copy client files
COPY client/ ./client/

# Build the client
RUN cd client && npm install && npm run build

# Copy the rest
COPY . .

EXPOSE 3001

CMD ["node", "server.js"]

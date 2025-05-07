FROM node:20

WORKDIR /app

COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Create uploads directory in container
RUN mkdir -p uploads

# Expose the port your app runs on
EXPOSE 5000

# Start the server
CMD ["node", "app.js"]

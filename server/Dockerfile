FROM node:12

# Create app directory
WORKDIR /usr/src/app
RUN mkdir -p data/system && mkdir -p data/app

# Install app dependencies
COPY package*.json ./
RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 3030
CMD [ "npm", "run", "prod" ]
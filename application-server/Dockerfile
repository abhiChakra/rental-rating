# using node base image
FROM node:alpine

# setting working dir inside container
WORKDIR /application-server

# required to install packages
COPY package.json ./

# installing npm packages
RUN npm install

COPY src ./src

# exposing port 5000 on container
EXPOSE 5000

CMD ["npm", "run", "start"]
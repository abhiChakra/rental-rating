# first building react project, using node base image
FROM node:alpine as build-stage

# setting working dir inside container
WORKDIR /react-app

# required to install packages
COPY package.json ./

# installing npm packages
RUN npm install

# copying over react source material
COPY src ./src

# copying over .env file
COPY .env ./

# copying over further react material
COPY public ./public

# copying over our nginx config file
COPY nginx_container.conf ./

# creating production build to serve through nginx
RUN npm run build

# starting second, nginx build-stage
FROM nginx:1.15

# removing default nginx config file
RUN rm /etc/nginx/conf.d/default.conf

# exposing port 3000 on container
EXPOSE 3000

# copying our nginx config
COPY --from=build-stage /react-app/nginx_container.conf /etc/nginx/conf.d/

# copying production build from last stage to serve through nginx
COPY --from=build-stage /react-app/build/ /usr/share/nginx/html
FROM node:15

WORKDIR /usr/app
COPY package.json .
RUN npm i --only=prod
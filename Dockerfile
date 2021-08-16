FROM node:15

WORKDIR /usr/app
COPY package.json .
RUN npm i --only=prod
COPY ./dist ./dist
EXPOSE 3000:3000
CMD ["npm","start"]
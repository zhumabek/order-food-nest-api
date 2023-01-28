FROM node:14-buster

RUN mkdir -p /app
WORKDIR /app
COPY package.json /app
COPY package-lock.json /app

RUN npm install

COPY . /app

EXPOSE 5500

CMD npm run build && npm run start:prod

FROM node:alpine3.12

RUN mkdir -p /usr/app

RUN npm install -g serve

WORKDIR /usr/app

COPY package*.json .

COPY build build

ENV PORT=80

EXPOSE 80

CMD serve -s build
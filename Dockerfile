FROM node:18-alpine

USER node

WORKDIR /app

RUN mkdir /app/uploads

COPY package.json .

RUN npm install

COPY . .

EXPOSE 9000

CMD ["npm", "start"]
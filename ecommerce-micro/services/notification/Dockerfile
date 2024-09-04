FROM node:20.9.0-alpine

WORKDIR /app/services/notification

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 6060 

CMD ["npm", "start"]
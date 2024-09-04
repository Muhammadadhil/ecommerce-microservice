FROM node:20.9.0-alpine

WORKDIR /app/services/order

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5050 

CMD ["npm", "start"]
FROM node:20.9.0-alpine

WORKDIR /app/services/product

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4040 

CMD ["npm", "start"]
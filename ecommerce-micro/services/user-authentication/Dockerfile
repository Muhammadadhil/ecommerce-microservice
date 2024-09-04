FROM node:20.9.0-alpine

WORKDIR /app/services/user-auth

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3030 

CMD ["npm", "start"]
FROM node:current

WORKDIR /app
COPY . .

COPY package*.json ./

RUN npm install
RUN npm install -g nodemon


ENTRYPOINT ["nodemon", "main.js"]
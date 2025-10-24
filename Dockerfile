# start with node.js box that is super leight weight (box created)
FROM node:18-alpine

# create a main folder called /app inside the box
WORKDIR /app

# copy package.json file from our project to the box's /app folder
COPY package*.json ./

# install all depedencies
RUN npm install

# copies all the rest of your lifes
COPY  . .

# tells the box inside /app uses port 5000
EXPOSE 5000

CMD ["npm", "start"]
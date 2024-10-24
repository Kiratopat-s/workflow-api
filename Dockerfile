FROM node:20-alpine AS test_build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run test 

RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY --from=test_build /app .

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
FROM node:lts-alpine AS build-stage

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:lts-alpine AS production-stage

WORKDIR /app

COPY --from=build-stage /app/dist /app/dist

RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]

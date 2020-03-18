FROM node:10-slim
WORKDIR /server
COPY ["package.json", "yarn.lock", "./"]
RUN yarn install
COPY . .
RUN yarn specs:build
CMD ["yarn", "start"]

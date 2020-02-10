FROM node:13

LABEL maintainer="Allen Lee <allen.lee@asu.edu>"

EXPOSE 3000

WORKDIR /code/client

COPY package.json /code/client
RUN yarn install

COPY . /code/client

ENV NODE_ENV=development

CMD ["yarn", "serve"]

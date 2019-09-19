FROM node:12

LABEL maintainer="Allen Lee <allen.lee@asu.edu>"

EXPOSE 3000

WORKDIR /code

COPY package.json /code
RUN yarn install

COPY . /code

CMD ["yarn", "serve"]

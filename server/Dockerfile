FROM node:12

LABEL maintainer="Allen Lee <allen.lee@asu.edu>"

EXPOSE 3000

WORKDIR /code

COPY ./deploy/wait-for-it.sh /code

COPY package.json /code
RUN yarn install

COPY . /code

CMD ["wait-for-it.sh", "yarn", "start"]
ARG BASE_IMAGE
FROM ${BASE_IMAGE}

LABEL maintainer="Allen Lee <allen.lee@asu.edu>"

EXPOSE 3000

WORKDIR /code/client

COPY ./client/package.json ./client/yarn.lock /code/client/
RUN yarn install

COPY ./shared/package.json ./shared/yarn.lock /code/shared/
RUN cd /code/shared && yarn install

COPY . /code/client

ENV NODE_ENV=development

CMD ["yarn", "serve"]

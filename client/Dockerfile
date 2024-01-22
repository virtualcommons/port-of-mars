FROM node:lts-bookworm

LABEL maintainer="Allen Lee <allen.lee@asu.edu>"

EXPOSE 3000

WORKDIR /code/client

COPY ./client/package.json ./client/package-lock.json /code/client/
RUN npm install
RUN ls /code/client/node_modules

COPY ./shared/package.json ./shared/package-lock.json /code/shared/
RUN cd /code/shared && npm install

COPY . /code/client

ENV NODE_ENV=development

CMD ["npm", "run", "serve"]

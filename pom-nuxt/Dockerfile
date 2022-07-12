# syntax=docker/dockerfile:1

FROM node:16-bullseye

LABEL maintainer="Center for Behavior, Institutions, and the Environment <virtualcommons-dev@googlegroups.com>"

EXPOSE 3000

RUN apt-get update && \
    apt-get install -y \
    postgresql-client \
    python3-pip \
    python3-dev \
    libpq-dev \
    libevent-dev && \
    pip3 install pgcli && \
    apt-get upgrade -y -o Dpkg::Options::="--force-confold" && \
    apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/

WORKDIR /code/web 

COPY package.json yarn.lock /code/web/

RUN set -ex; \
    if [ "$NODE_ENV" = "production" ]; then \
    yarn install --no-cache --frozen-lockfile --production; \
    elif [ "$NODE_ENV" = "test" ]; then \
    yarn install --no-cache --frozen-lockfile; \
    else \
    yarn install; \
    fi; \
    yarn cache clean;

COPY . /code/web

CMD ["yarn", "dev"]
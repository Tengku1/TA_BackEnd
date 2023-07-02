FROM node:fermium-buster AS dist
COPY package.json yarn.lock ./

RUN yarn install

COPY . ./

RUN yarn build

FROM node:fermium-buster AS node_modules
COPY package.json yarn.lock ./

RUN yarn install --prod

FROM node:fermium-buster

ARG PORT=3000

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY --from=dist dist /usr/src/app/dist
COPY --from=node_modules node_modules /usr/src/app/node_modules

COPY . /usr/src/app

RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 --no-install-recommends \
    && rm -rf /var/lib/apt/lists/* \
    && rm -rf /usr/src/app/pipeline /usr/src/app/env-sample /usr/src/app/Dockerfile

EXPOSE $PORT

CMD [ "yarn", "start:prod" ]

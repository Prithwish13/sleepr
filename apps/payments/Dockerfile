FROM node:alpine As development

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./
COPY tsconfig.json ./tsconfig.json
COPY nest-cli.json ./nest-cli.json


RUN npm install

COPY apps/payments ./apps/payments
COPY libs ./libs

RUN cd apps/payments && npm install


RUN npm run build payments

FROM node:alpine As production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR  /usr/src/app


COPY package.json ./
COPY package-lock.json ./
RUN npm install --only=production

COPY --from=development /usr/src/app/dist ./dist

CMD [ "node", "dist/apps/payments/main" ]



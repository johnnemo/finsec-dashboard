FROM node:10 as builder
# set working directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app
COPY package-lock.json /usr/src/app
# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH
ENV NODE_ENV prod
# install and cache app dependencies
RUN npm ci --no-audit --prefer-offline
COPY . /usr/src/app
RUN npm run-script build

##########################
# The actual image below #
##########################
#FROM nginx:alpine
##COPY nginx.conf /etc/nginx/nginx.conf
#WORKDIR /usr/share/nginx/html
#COPY nginx-default.conf.template /etc/nginx/conf.d/default.conf.template
#COPY keycloak.template /etc/keycloak.template
#
##COPY dist/ .
#COPY --from=builder /usr/src/app/dist .
#EXPOSE 80
## run nginx
#COPY docker-entrypoint.sh /
#ENTRYPOINT ["/docker-entrypoint.sh"]
#CMD ["nginx", "-g", "daemon off;"]

FROM node:12-alpine

WORKDIR /app

RUN npm install pm2 -g

ENV PORT 80

COPY ./server .
RUN npm ci --no-audit --prefer-offline && npm run-script build

RUN mkdir /app/client
COPY --from=builder /usr/src/app/dist ./dist/client

CMD ["pm2-runtime", "dist/indexFinsec.js"]


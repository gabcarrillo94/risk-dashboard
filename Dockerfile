FROM node:6.12.3

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app
RUN npm install
RUN npm install --global bower
RUN npm install --global grunt-cli
RUN npm link gulp
COPY . /usr/src/app
RUN bower install --allow-root

RUN echo '{"local": { "env": { "domain": "localhost", "port": 8080, "ssl": false } }, "production": { "env": { "domain": "dev3.ceptinel.com", "port": "", "ssl": true }}}' | tee configFile.json > /dev/null

#RUN gulp build
#EXPOSE 3000
#CMD gulp serve
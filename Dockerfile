FROM node:boron

ENV TZ=Asia/Kolkata
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone


RUN mkdir -p /usr/rawPoller
WORKDIR /usr/rawPoller

COPY package.json /usr/rawPoller
RUN npm install

COPY src/. /usr/rawPoller/src

CMD ["npm","start"]




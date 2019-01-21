FROM node:10.13.0

WORKDIR /app

RUN git clone https://github.com/debuggy/firecream.git
RUN cd firecream && mkdir data && touch data/firecream.db && npm install

EXPOSE 8080

CMD ["npm", "start"]

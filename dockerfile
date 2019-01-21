FROM node:10.13.0


WORKDIR /app/firecream
RUN mkdir data && touch data/firecream.db && npm install

EXPOSE 8080

ENTRYPOINT git clone https://github.com/debuggy/firecream.git && \
           cd firecream && \
           mkdir data && \
           touch data/firecream.db && \
           npm install && \
           npm start

ARG FIREBASE_TOOL_VERSION
FROM openjdk:13.0.1-buster
WORKDIR /usr/local
COPY ./docker-entrypoint.sh /usr/local/

RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN apt-get install -y nodejs
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt update
RUN apt install --no-install-recommends yarn
RUN npm install -g firebase-tools@$FIREBASE_TOOL_VERSION

ENTRYPOINT bash -c "bash /usr/local/docker-entrypoint.sh"

EXPOSE 5005 8080

FROM alpine:3.4

MAINTAINER y.ishii@azoom.jp

ENV MAILHOG_VERSION 0.2.1
ENV PATH $PATH:/usr/local/bundle/bin

WORKDIR /work

COPY ./mailhog/MailHog_linux_amd64.sha1 .

RUN apk --update add openssl && \
    wget https://github.com/mailhog/MailHog/releases/download/v${MAILHOG_VERSION}/MailHog_linux_amd64 && \
    sha1sum -c MailHog_linux_amd64.sha1 && \
    mv MailHog_linux_amd64 /usr/local/bin/MailHog && \
    chmod +x /usr/local/bin/MailHog && \
    apk del openssl && \
    rm MailHog_linux_amd64.sha1 && \
    rm /var/cache/apk/*

EXPOSE 1025 8025

ENTRYPOINT ["MailHog"]

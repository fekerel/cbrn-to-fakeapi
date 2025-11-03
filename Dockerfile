# The FROM instruction initializes a new build stage and sets the Base Image for subsequent instructions
# alpine will serve as the base image
FROM cregistry.k2.net/devops/alpine:3.20

# The LABEL instruction adds metadata to an image
LABEL maintainer="TMGM"

ADD ./PCAcert.cer /usr/local/share/ca-certificates/
RUN apk add --no-cache \
    --repository http://dl-cdn.alpinelinux.org/alpine/v3.20/main \
    ca-certificates
RUN update-ca-certificates

# The RUN instruction will execute any commands in a new layer on top of the current image and commit the resultsp
# apk is the package manager for alpine based images
# using that installing necessary packages
RUN apk update && apk --no-cache add \
    nodejs \
    npm \
    && npm install -g \
    npm \
    yarn \
    # Clean up obsolete files:
    && rm -rf \
    /tmp/* \
    /root/.npm

RUN apk add --update python3 make g++ \
    && rm -rf /var/cache/apk/*

# The WORKDIR instruction sets the working directory for any RUN, CMD, ENTRYPOINT, COPY and ADD
# instructions that follow it in the Dockerfile.
WORKDIR /usr/lib/mocha

# The COPY instruction copies new files or directories from <src> and
# adds them to the filesystem of the container at the path <dest>.
COPY package.json /usr/lib/mocha

#COPY yarn.lock /usr/lib/wdio

# Add this location to the NODE_PATH
ENV NODE_PATH /usr/lib/mocha/node_modules
ENV NODE_TLS_REJECT_UNAUTHORIZED 0
# Installing all the dependecies present in the package.json file
RUN npm install \
    # Clean up obsolete files:
    && rm -rf \
    /tmp/* \
    /root/.npm

# Copying all the source code into the folder
COPY . /usr/lib/mocha
ENV DOCKER_SERVICE true
# Add .bin to PATH to enable npm run scripts
ENV PATH $PATH:/usr/lib/mocha/node_modules/.bin
#ENV EXTRA_PARAMETERS --reporter=allure --suite=objectManager --environment=SEL
#ARG parameters
#ENV PARAMS=$parameters
#VOLUME ["/runner"]

# The main purpose of a CMD is to provide default commands to an executing container
#CMD ["yarn", "run", "test:situationMaps"]
# We will use ENTRYPOINT to configure docker run with external parameters like suite and environment
ENTRYPOINT ["yarn", "run", "runner"]
#ENTRYPOINT yarn run runner:allure $PARAMS

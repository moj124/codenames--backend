#Makefile variables, make code simplier
COMPOSE ?= composer
COMPOSE_FILE ?= docker-compose.dev.yml
DOCKER_COMPOSE ?= docker-compose -f ${COMPOSE_FILE}
DOCKER_RUN ?= ${DOCKER_COMPOSE} run --rm --service-ports

# PHONY sets a virtual target when running Makefile commands, avoids targetting real files!
# -----------------------------------------------------------------------------------------------
install:
		${DOCKER_RUN} api npm install
.PHONY: install

build:
	${DOCKER_COMPOSE} build
.PHONY: build

# update dependencies
update:
	${COMPOSE} update
.PHONY: update
# removes all containers associated with the api
down:
	${DOCKER_COMPOSE} down
.PHONY: down

# starts the images which runs in the an isolated environment
up-all:
	${DOCKER_COMPOSE} up -d api
	${DOCKER_COMPOSE} up -d db
.PHONY: up-all

serve:
	npm run serve
.PHONY: serve

# Useful aliases
# -----------------------------------------------------------------------------------------------

# first remove all docker containers if still running start up mailer, database images
dev: down up-all
.PHONY: dev
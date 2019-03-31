.PHONY: all build

all:
	drone exec

build: node_modules
	yarn lint
	yarn build
	tar -zcf dist.tgz -C dist .

node_modules:
	yarn install

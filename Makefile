.PHONY: create docker enter install serve build test

create:
	@if [ -d "src" ]; then echo "Project src folder exists"; exit 1; else echo "Creating project src folder"; fi
	docker run --rm -it --env-file .env.local --net=host -v ${PWD}:/app -w /app crusttech/front-dev vue create .
	docker run --rm -it --env-file .env.local --net=host -v ${PWD}:/app -w /app crusttech/front-dev yarn add axios --save

docker:
	cd docker && docker build --no-cache --rm -f Dockerfile.dev -t crusttech/front-dev . && cd ..

enter:
	docker run --rm -it --env-file .env.local --net=host -v ${PWD}:/app -w /app crusttech/front-dev

install:
	docker run --rm -it --env-file .env.local --net=host -v ${PWD}:/app -w /app crusttech/front-dev yarn install

serve:
	docker run --rm -it --env-file .env.local --net=host -v ${PWD}:/app -w /app crusttech/front-dev yarn serve

build:
	docker run --rm -it --env-file .env.local --net=host -v ${PWD}:/app -w /app crusttech/front-dev yarn build

lint:
	docker run --rm -it --env-file .env.local --net=host -v ${PWD}:/app -w /app crusttech/front-dev yarn lint

test:
	docker run --rm -it --env-file .env.local --net=host -v ${PWD}:/app -w /app crusttech/front-dev yarn test:unit


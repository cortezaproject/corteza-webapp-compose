.PHONY: create docker enter install serve build test

create:
	@if [ -d "src" ]; then echo "Project src folder exists"; exit 1; else echo "Creating project src folder"; fi
	docker run -it --env-file .env.local --net=host -v ${PWD}:/app -w /app crusttech/front-dev vue create .
	docker run -it --env-file .env.local --net=host -v ${PWD}:/app -w /app crusttech/front-dev yarn add axios --save

docker:
	cd docker && docker build --no-cache --rm -f Dockerfile.dev -t crusttech/front-dev . && cd ..

enter:
	docker run -it --env-file .env.local --net=host -v ${PWD}:/app -w /app crusttech/front-dev

install:
	docker run -it --env-file .env.local --net=host -v ${PWD}:/app -w /app crusttech/front-dev yarn install

serve:
	docker run -it --env-file .env.local --net=host -v ${PWD}:/app -w /app crusttech/front-dev yarn serve

build:
	docker run -it --env-file .env.local --net=host -v ${PWD}:/app -w /app crusttech/front-dev yarn build

test:
	docker run -it --env-file .env.local --net=host -v ${PWD}:/app -w /app crusttech/front-dev yarn lint
	docker run -it --env-file .env.local --net=host -v ${PWD}:/app -w /app crusttech/front-dev yarn test:unit


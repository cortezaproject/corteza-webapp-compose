.PHONY: deploy clean docker enter

docker:
	cd docker && docker build --rm -f Dockerfile.dev -t crusttech/front-dev . && cd ..

enter:
	docker run -it --env-file .env.local --net=host -v ${PWD}:/app -w /app crusttech/front-dev

serve:
	docker run -it --env-file .env.local --net=host -v ${PWD}/${name}:/app/${name} -w /app/${name} crusttech/front-dev yarn serve

build:
	docker run -it --env-file .env.local --net=host -v ${PWD}/${name}:/app/${name} -w /app/${name} crusttech/front-dev yarn build

test:
	docker run -it --env-file .env.local --net=host -v ${PWD}/${name}:/app/${name} -w /app/${name} crusttech/front-dev yarn lint
	docker run -it --env-file .env.local --net=host -v ${PWD}/${name}:/app/${name} -w /app/${name} crusttech/front-dev yarn test:unit

create:
	rm -rf ${name}
	docker run -it --env-file .env.local --net=host -v ${PWD}:/app -w /app crusttech/front-dev vue create ${name}
	docker run -it --env-file .env.local --net=host -v ${PWD}:/app/${name} -w /app crusttech/front-dev yarn add axios --save

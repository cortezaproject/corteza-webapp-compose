.PHONY: deploy clean docker docker-enter

build: dist deploy clean

dist:
	yarn build production

deploy:
	rsync -var dist/* sookie.kendu.si:/opt/crust.sam.spa/

clean:
	rm -rf dist

docker:
	cd docker && docker build --rm -f Dockerfile.dev -t crusttech/crm-front-dev . && cd ..

docker-enter:
	docker run -it --net=host -v ${PWD}:/app -w /app crusttech/crm-front-dev

docker-serve:
	docker run -it --net=host -v ${PWD}/crm:/app/crm -w /app/crm crusttech/crm-front-dev yarn serve

docker-build:
	docker run -it --net=host -v ${PWD}/crm:/app/crm -w /app/crm crusttech/crm-front-dev yarn build

docker-test:
	docker run -it --net=host -v ${PWD}/crm:/app/crm -w /app/crm crusttech/crm-front-dev yarn lint
	docker run -it --net=host -v ${PWD}/crm:/app/crm -w /app/crm crusttech/crm-front-dev yarn test:unit

create:
	rm -rf crm
	docker run -it --net=host -v ${PWD}:/app -w /app crusttech/crm-front-dev vue create crm
	docker run -it --net=host -v ${PWD}:/app/crm -w /app crusttech/crm-front-dev yarn add axios --save
	rsync -ai --del src/ crm/src/
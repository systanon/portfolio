docker container rm --force 'portfolio_production'
docker image rm --force 'portfolio-production'

docker build --file Dockerfile.production --tag 'portfolio-production' .
docker run --name 'portfolio_production' --detach -p 80:80 'portfolio-production'

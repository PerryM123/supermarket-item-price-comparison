.PHONY: docs app laravel
docs:
	docker run --rm -p 9090:8080 -e SWAGGER_JSON=/spec/openapi.yaml -v "$(PWD)/docs:/spec" swaggerapi/swagger-ui

laravel:
	docker compose exec backend sh

laravel-logs:
	docker compose exec backend tail -f storage/logs/laravel.log

laravel-migrate-seed:
	docker compose exec backend php artisan migrate --seed

laravel-migrate-seed-refresh:
	docker compose exec backend php artisan migrate:refresh --seed

laravel-migrate-fresh:
	docker compose exec backend php artisan migrate:fresh

up:
	docker-compose up -d

down:
	docker-compose down

build:
	docker compose up --build

restart:
	docker compose restart

up-build:
	docker-compose up -d --build

# Start normally
up:
	docker compose up -d

# Rebuild (uses cache)
build:
	docker compose up --build -d

# Rebuild with NO cache
build-nocache:
	docker compose build --no-cache
	docker compose up -d

# Stop and remove volumes
reset:
	docker compose down -v

# Show logs from back end service
logs:
	docker compose logs -f backend

# shell into backend container
sh:
	docker compose exec backend sh

# Shell into postgres
psql:
	docker compose exec postgres psql -U social_soko_owner -d social_soko_dev

# Run migrations

# Run migrations inside docker
migrate:
	docker compose exec backend npx sequelize-cli db:migrate

# Revert latest migration
migrate-revert:
	docker compose exec backend npx sequelize-cli db:migrate:undo:all

# Run all seeders
seed:
	docker compose exec backend npx sequelize-cli db:seed:all

unseed:
	docker compose exec backend npx sequelize-cli db:seed:undo:all


# Reset database: drop, create, migrate, seed (dev only)
db-reset:
	make reset
	make up
	sleep 5
	make migrate
	make seed

# Test Sequelize connection
test-db:
	docker compose exec backend node test-sequelize-connection.js
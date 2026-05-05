############################################################
## 🧾 GENERAL
############################################################

# High-level environment selector:
#   dev   -> .env
#   test  -> .env.test
#   prod  -> .env.production
ENV ?= dev

# Map ENV to an env-file
ifeq ($(ENV),dev)
  ENV_FILE := .env.development
endif

ifeq ($(ENV),test)
  ENV_FILE := .env.test
endif

ifeq ($(ENV),prod)
  ENV_FILE := .env
endif

# Base docker compose command (always uses the selected env file)
COMPOSE := docker compose --env-file $(ENV_FILE)

.PHONY: \
  up up-dev up-test up-prod \
  down restart build build-nocache reset ps \
  backend-logs email-logs postgres-logs all-logs \
  sh sh-backend sh-postgres psql psql-app psql-super \
  migrate migrate-revert seed unseed make-migration db-reset test-db \
  add add-dev add-many add-many-dev deps \
  test-backend email-test


############################################################
## 🐳 DOCKER LIFECYCLE
############################################################

# Start all services in the background
up:
	@echo ""
	@echo "🚀 Starting Docker containers..."
	@echo "🌎 ENV: $(ENV)"
	@echo "📄 Using environment file: $(ENV_FILE)"
	@echo ""
	$(COMPOSE) up -d

# Convenience shortcuts for environments
up-dev:
	@$(MAKE) ENV=dev up

up-test:
	@$(MAKE) ENV=test up

up-prod:
	@$(MAKE) ENV=prod up

# Stop all services (containers left intact)
down:
	@echo "\n🛑 Stopping Docker containers...\n"
	$(COMPOSE) down

# Restart all services
restart:
	@echo "\n🔁 Restarting Docker containers...\n"
	$(COMPOSE) down
	$(COMPOSE) up -d

# Rebuild images (using cache) and start
build:
	@echo "\n🔧 Rebuilding services using cache...\n"
	$(COMPOSE) up --build -d

# Rebuild images without cache and start
build-nocache:
	@echo "\n♻️ Rebuilding services with NO cache...\n"
	$(COMPOSE) build --no-cache
	$(COMPOSE) up -d

# Stop containers and remove volumes (full reset of Postgres data, etc.)
reset:
	@echo "\n🧨 Stopping containers & removing volumes...\n"
	$(COMPOSE) down -v

# Show running containers for this compose project
ps:
	@echo "\n📊 Docker compose services status:\n"
	$(COMPOSE) ps


############################################################
## 📜 LOGS
############################################################

# Tail backend logs
backend-logs:
	@echo "\n📄 Back-end logs (CTRL+C to exit)...\n"
	$(COMPOSE) logs -f backend

# Tail email worker logs
email-logs:
	@echo "\n📨 Email worker logs (CTRL+C to exit)...\n"
	$(COMPOSE) logs -f email_worker

# Tail Postgres logs
postgres-logs:
	@echo "\n🐘 Postgres logs (CTRL+C to exit)...\n"
	$(COMPOSE) logs -f postgres

# Tail all service logs
all-logs:
	@echo "\n📚 All service logs (CTRL+C to exit)...\n"
	$(COMPOSE) logs -f


############################################################
## 🐚 SHELL / POSTGRES ACCESS
############################################################

# Shell into backend container
sh sh-backend:
	@echo "\n🐚 Entering backend container...\n"
	$(COMPOSE) exec backend sh

# Shell into Postgres container
sh-postgres:
	@echo "\n🐚 Entering Postgres container shell...\n"
	$(COMPOSE) exec postgres bash

# Generic psql (override USER + DB on call: make psql USER=foo DB=bar)
psql:
	@echo "\n🐘 Opening generic Postgres psql shell...\n"
	$(COMPOSE) exec postgres psql -U $(USER) -d $(DB)

# psql into app database as app user (uses env vars inside container)
psql-app:
	@echo "\n🐘 Opening psql as application user (DB_USER/DB_NAME)...\n"
	$(COMPOSE) exec postgres sh -c 'psql -U "$$DB_USER" -d "$$DB_NAME"'

# psql into super admin database
psql-super:
	@echo "\n🐘 Opening psql as super admin (SUPER_ADMIN_USER/SUPER_ADMIN_DB)...\n"
	$(COMPOSE) exec postgres sh -c 'psql -U "$$SUPER_ADMIN_USER" -d "$$SUPER_ADMIN_DB"'


############################################################
## 🗄️ SEQUELIZE / DATABASE MANAGEMENT
############################################################

# Run all pending migrations
migrate:
	@echo "\n📐 Running Sequelize migrations...\n"
	$(COMPOSE) exec backend npx sequelize-cli db:migrate

# Undo all migrations (dangerous in shared envs)
migrate-revert:
	@echo "\n⏪ Reverting ALL migrations...\n"
	$(COMPOSE) exec backend npx sequelize-cli db:migrate:undo:all

# Run all seeders
seed:
	@echo "\n🌱 Running database seeders...\n"
	$(COMPOSE) exec backend npx sequelize-cli db:seed:all

# Undo all seeders
unseed:
	@echo "\n🧹 Undoing ALL seeders...\n"
	$(COMPOSE) exec backend npx sequelize-cli db:seed:undo:all

# Generate a new migration: make make-migration name=create-users-table
make-migration:
	@echo "\n📝 Creating a new migration: $(name)\n"
	$(COMPOSE) exec backend npx sequelize-cli migration:generate --name $(name)

# Full DB reset: drop volumes → up → migrate → seed
db-reset:
	@echo "\n🧨 FULL DATABASE RESET (drop → up → migrate → seed)\n"
	@$(MAKE) ENV=$(ENV) reset
	@$(MAKE) ENV=$(ENV) up
	@echo "\n⌛ Waiting for Postgres to boot...\n"
	sleep 8
	@$(MAKE) ENV=$(ENV) migrate
	@$(MAKE) ENV=$(ENV) seed

# Simple connection test script (inside backend)
test-db:
	@echo "\n🔌 Testing Sequelize database connection...\n"
	$(COMPOSE) exec backend node test-sequelize-connection.js


############################################################
## 📦 PACKAGE MANAGEMENT (INSIDE DOCKER)
############################################################

# Install a single package in backend: make add pkg=lodash
add:
	@echo "\n📦 Installing package: $(pkg)\n"
	$(COMPOSE) exec backend npm install $(pkg)

# Install a single devDependency in backend: make add-dev pkg=jest
add-dev:
	@echo "\n🧪 Installing DEV package: $(pkg)\n"
	$(COMPOSE) exec backend npm install --save-dev $(pkg)

# Install multiple packages: make add-many pkgs="lodash axios"
add-many:
	@echo "\n📦 Installing multiple packages: $(pkgs)\n"
	$(COMPOSE) exec backend npm install $(pkgs)

# Install multiple devDependencies: make add-many-dev pkgs="jest @types/jest"
add-many-dev:
	@echo "\n🧪 Installing multiple DEV packages: $(pkgs)\n"
	$(COMPOSE) exec backend npm install --save-dev $(pkgs)

# Show top-level dependencies
deps:
	@echo "\n📦 Listing installed backend dependencies...\n"
	$(COMPOSE) exec backend npm list --depth=0


############################################################
## 🧪 TESTING
############################################################

# Run Jest backend tests
test-backend:
	@echo "\n🧪 Running Jest backend tests...\n"
	$(COMPOSE) exec backend npm test


############################################################
## 📧 EMAIL SERVICE
############################################################

# Test email worker: make email-test EMAIL_TO="you@example.com"
email-test:
	@echo ""
	@echo "📧  Testing email service..."
	@echo ""
	$(COMPOSE) run --rm email_worker \
		node workers/emailWorker.js send \
		--to "$(EMAIL_TO)" \
		--template "test.basic" \
		--props {}

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

# Tail frontend logs
frontend-logs:
	@echo "\n📄 Front-end logs (CTRL+C to exit)...\n"
	$(COMPOSE) logs -f frontend

############################################################
## 🐚 SHELL /
############################################################

# Shell into frontend container
sh:
	@echo "\n🐚 Entering frontend container...\n"
	$(COMPOSE) exec frontend sh


############################################################
## 📦 PACKAGE MANAGEMENT (INSIDE DOCKER)
############################################################

# Install a single package in frontend: make add pkg=lodash
add:
	@echo "\n📦 Installing package: $(pkg)\n"
	$(COMPOSE) exec frontend npm install $(pkg)

# Install a single devDependency in frontend: make add-dev pkg=jest
add-dev:
	@echo "\n🧪 Installing DEV package: $(pkg)\n"
	$(COMPOSE) exec frontend npm install --save-dev $(pkg)

# Install multiple packages: make add-many pkgs="lodash axios"
add-many:
	@echo "\n📦 Installing multiple packages: $(pkgs)\n"
	$(COMPOSE) exec frontend npm install $(pkgs)

# Install multiple devDependencies: make add-many-dev pkgs="jest @types/jest"
add-many-dev:
	@echo "\n🧪 Installing multiple DEV packages: $(pkgs)\n"
	$(COMPOSE) exec frontend npm install --save-dev $(pkgs)

# Show top-level dependencies
deps:
	@echo "\n📦 Listing installed backend dependencies...\n"
	$(COMPOSE) exec frontend npm list --depth=0
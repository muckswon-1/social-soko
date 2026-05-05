#!/bin/bash
set -e

echo "==> Initializing application database + user..."

# Require that env vars exist
: "${DB_NAME:?Need DB_NAME}"
: "${DB_USER:?Need DB_USER}"
: "${DB_PASS:?Need DB_PASS}"

# 1. Create role if not exists
echo "==> Creating application role '${DB_USER}' (if not exists)..."
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    DO
    \$do\$
    BEGIN
        IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '${DB_USER}') THEN
            CREATE ROLE ${DB_USER}
                LOGIN
                PASSWORD '${DB_PASS}'
                NOSUPERUSER
                NOCREATEDB
                NOCREATEROLE
                INHERIT;
        END IF;
    END
    \$do\$;
EOSQL

# 2. Create database if not exists (NO DO BLOCK!)
echo "==> Checking if database '${DB_NAME}' exists..."
DB_EXISTS=$(psql -tA --username "$POSTGRES_USER" -c "SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'")

if [ "$DB_EXISTS" != "1" ]; then
    echo "==> Creating database '${DB_NAME}'..."
    psql --username "$POSTGRES_USER" <<-EOSQL
        CREATE DATABASE ${DB_NAME}
            OWNER ${DB_USER}
            TEMPLATE template0
            ENCODING 'UTF8';
EOSQL
else
    echo "==> Database '${DB_NAME}' already exists. Skipping creation."
fi

# 3. Grant privileges inside the DB
echo "==> Granting privileges to '${DB_USER}' on '${DB_NAME}'..."
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$DB_NAME" <<-EOSQL
    GRANT ALL ON SCHEMA public TO ${DB_USER};
    GRANT ALL ON ALL TABLES    IN SCHEMA public TO ${DB_USER};
    GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO ${DB_USER};
    GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO ${DB_USER};

    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ${DB_USER};
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO ${DB_USER};
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO ${DB_USER};
EOSQL

echo "==> Application DB + user initialization complete!"

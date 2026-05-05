-- create social_soko_dev
-- Create your non-superuser app user
CREATE USER social_soko_owner
WITH
    PASSWORD '18qPLESnbQRrkmNB' NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT;

-- Make them owner of devdb so Sequelize can migrate
ALTER DATABASE social_soko_dev OWNER TO social_soko_owner;

-- (Optional but useful) grant privileges explicitly
GRANT ALL PRIVILEGES ON DATABASE social_soko_dev TO social_soko_owner;
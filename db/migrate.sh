#!/bin/bash
echo -e "dump remote db to migrate-backup.sql\n"
echo -e "\n"
ssh smooms "pg_dump -h smooms.cojo00b63jgd.us-east-2.rds.amazonaws.com -p 5432 -Usmooms_admin -d postgres" > migrate-backup.sql
echo -e "dumping local data\n"
pg_dump -h localhost -p5432 -U smooms_admin -d smooms > migrate-local-backup.sql
echo -e "delete local data\n"
echo -e "\n"
dropdb smooms -h localhost -p5432 -Usmooms_admin
echo -e "create new local db\n"
createdb smooms -h localhost -p5432 -Usmooms_admin
echo -e "sourcing env file for relay password\n"
source "$(dirname "${BASH_SOURCE[0]}")/../.env"
export PGPASSWORD;
echo -e "create relay user\n"
psql -W -h localhost -p5432 -U smooms_admin -d smooms -c "CREATE USER relay with encrypted password '$PGPASSWORD'; GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO relay; GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO relay; "
echo -e "create rdsadmin user\n"
psql -W -h localhost -p5432 -U smooms_admin -d smooms -c "CREATE USER rdsadmin with encrypted password '$PGPASSWORD'"
echo -e "updating local db with remote data\n"
psql -W -h localhost -p5432 -U smooms_admin -d smooms < migrate-backup.sql
echo -e "run tests\n"
read -n 1 -s -r -p "Press any key to continue"
npm run test
echo -e "migrate local\n"
psql -W -h localhost -p5432 -U smooms_admin -d smooms < staging.sql
echo -e "run tests\n"
read -n 1 -s -r -p "Press any key to continue"
npm run test
echo -e "migrate remotely\n"
read -n 1 -s -r -p "Press any key to continue"
echo -e "\n"
scp staging.sql smooms:/home/ubuntu/
ssh smooms "psql -h smooms.cojo00b63jgd.us-east-2.rds.amazonaws.com -p 5432 -Usmooms_admin -d postgres -f /home/ubuntu/staging.sql; rm /home/ubuntu/staging.sql"
#!/bin/bash
DB="app"
USER="app"
BACKUP="./db_backup/backup_20260516_233557.sql.gz"
CONTAINER="supermarket-item-price-comparison-postgres-1"

if [ ! -f "$BACKUP" ]; then
  echo "Error: Backup file not found: $BACKUP"
  exit 1
fi

docker exec -i $CONTAINER psql -U $USER -d postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '$DB';"
docker exec -i $CONTAINER psql -U $USER -d postgres -c "DROP DATABASE IF EXISTS $DB;"
docker exec -i $CONTAINER psql -U $USER -d postgres -c "CREATE DATABASE $DB;"
gunzip -c $BACKUP | docker exec -i $CONTAINER psql -U $USER -d $DB

echo "Restore complete (Target file: $BACKUP)"


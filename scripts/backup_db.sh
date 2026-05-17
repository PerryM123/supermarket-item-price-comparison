#!/bin/bash
DB="app"
USER="app"
DB_BACKUP_DIRECTORY="db_backup"
BACKUP="./${DB_BACKUP_DIRECTORY}/backup_$(date +%Y%m%d_%H%M%S).sql.gz"
CONTAINER="supermarket-item-price-comparison-postgres-1"

mkdir -p ./$DB_BACKUP_DIRECTORY

docker exec -t supermarket-item-price-comparison-postgres-1 pg_dump -U app -d app | gzip > $BACKUP
echo "Backup created: $BACKUP"

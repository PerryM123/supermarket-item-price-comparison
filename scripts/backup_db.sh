#!/bin/bash
DB="app"
USER="app"
BACKUP="./db_backup/backup_$(date +%Y%m%d_%H%M%S).sql.gz"
CONTAINER="supermarket-item-price-comparison-postgres-1"

docker exec -t supermarket-item-price-comparison-postgres-1 pg_dump -U app -d app | gzip > $BACKUP
echo "Backup created: $BACKUP"


FROM php:8.3-fpm-alpine

RUN apk add --no-cache libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql

COPY uploads.ini /usr/local/etc/php/conf.d/uploads.ini

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

EXPOSE 9000

CMD ["php-fpm"]

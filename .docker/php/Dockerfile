FROM php:8.3-fpm-alpine

WORKDIR /var/www

ARG UID=1000
ARG GID=1000

# Instalacja podstawowych pakietów i zależności
RUN apk update && apk add --no-cache \
    build-base \
    autoconf \
    gcc \
    g++ \
    make \
    pcre-dev \
    git \
    curl \
    libpng-dev \
    libjpeg-turbo-dev \
    libwebp-dev \
    libzip-dev \
    libxml2-dev \
    freetype-dev \
    imagemagick-dev \
    linux-headers \
    postgresql-dev \
    nodejs \
    npm \
    shadow \
    bash \
    icu-dev \
    oniguruma-dev \
    zlib-dev \
    file \
    libc6-compat \
    zip \
    unzip \
    supervisor \
    libtool

# Konfiguracja i instalacja rozszerzeń PHP
RUN docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
    && docker-php-ext-install -j$(nproc) \
       pdo \
       pdo_mysql \
       mbstring \
       exif \
       pcntl \
       bcmath \
       gd \
       zip \
       intl \
       xml

# Instalacja rozszerzeń przez PECL
RUN pecl install redis \
    && docker-php-ext-enable \
       redis \
       opcache

# Konfiguracja PHP
COPY ./.docker/php/php-dev.ini /usr/local/etc/php/php.ini

# Konfiguracja użytkownika
RUN usermod -u ${UID} www-data \
    && groupmod -g ${GID} www-data

# Instalacja Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Kopiowanie kodu projektu
COPY --chown=www-data:www-data . /var/www

COPY ./.docker/start.sh /usr/local/bin/start.sh
RUN chmod +x /usr/local/bin/start.sh

USER www-data

CMD ["/usr/local/bin/start.sh"]

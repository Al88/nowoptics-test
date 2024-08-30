# GUIDE TO INSTALL THE NOWOPTICS TEST

## Clone the repo from Github
- git clone https://github.com/Al88/nowoptics-test.git

## Installing dependencies

- composer install
- npm install

## Modify the .env if you have your own STUN/TURN credentials,

- VITE_STUN_URL=
- VITE_TURN_URL=
- VITE_TURN_USERNAME=
- VITE_TURN_CREDENTIAL=

## Running migrations
- php artisan migrate

## Running Server
- php artisan serve
- php artisan reverb:start


## Running frontend
- npm run dev
- go to http://localhost:8000






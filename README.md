# travelApp
cloning project

install:
nodejs 20.18.0 LTS prebuild installer
Postgresql 17.0.1
Nvm - https://sourceforge.net/projects/nvm-for-windows.mirror/

in postgresql create user + password, create empty database travels

create .env from .env.example

get api key - node ace generate:key 
put user, password

npm install
node ace migration:run
node ace db:seed

run - npm run dev

(if there will be "welcome, notFound" go to page /login and log in with mail - admin@gmail.com, password - admin and logout)

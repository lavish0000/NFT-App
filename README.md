### --------------------------------------- CLIENT ---------------------------------------

## ENV Variables
Create a .env file inside client folder and these following variables\
    `REACT_APP_API_URL`=http://localhost:5000/api/ \
    `REACT_APP_S3_BUCKET`=S3-bucket name\
    `REACT_APP_S3_REGION`=S3-Region\
    `REACT_APP_ACCESS_KEY_ID`=S3-Access-Key-Id\
    `REACT_APP_SECRET_ACCESS_KEY`=S3-Secret-Access-Key\
    `REACT_APP_S3_URL_PREFIX`=S3-URL-Prefix

Go to client folder and run the following commands -

`npm i`\
`npm run dev`

## Available Scripts

- `npm run dev` - Runs the app in the development mode.\
- `npm test` - Launches the test runner in the interactive watch mode.\
- `npm run build` - Builds the app for production to the `build` folder.\
- `npm run coverage` - Create coverage reports , stored in the `coverage` folder.\


### --------------------------------------- SERVER ---------------------------------------
Go to server folder and follow the process below - 

## DB Setup

Create Database named `nft` in you PGSQL\
Command -> `CREATE DATABASE nft;` --> This will create `nft` DB in your PGSQL

## ENV Variables
Create a .env file inside server folder and add these following variables\

`PORT`={{app port}} --> Add server port number\
`PGHOST`={{host}} --> Add your PGSQL host, if you are using other than localhost\
`PGUSER`={{user}} --> Add your PGSQL user\
`PGPASSWORD`={{password}} --> Add your PGSQL password\
`PGDATABASE`={{database}} --> Add your PGSQL database name\
`PGPORT`={{port}} --> Add your PGSQL port, if you are using other than 5432(default)\
`DATABASE_URL`=postgres://{{user}}:{{password}}@localhost:{{port}} --> Replace with your PGSQL user, password, port (*REQUIRED* for migrations)\

## Install Deps
- Run `npm i`

## DB Migrations  
- Run `npm run migrate up -- --no-check-order`
- Run `npm run seed up -- --no-check-order`

Other Available Commands for migrations-

`npm run migrate up -- --no-check-order` --> For adding DB migration like tables and type etc.
`npm run seed up -- --no-check-order` --> For adding seed data migration like dummy rows to DB.

`npm run migrate down -- --no-check-order` --> For removing DB migration like tables and type etc.
`npm run seed down -- --no-check-order` --> For removing seed data migration like dummy rows to DB.

`npm run db-setup` --> For adding both DB and seed data migration at once. 

## Start Server

- Run `npm start`


## Available Scripts

- `start` - Runs the server in the development mode.\
- `build` - transpile TypeScript to ES6,
- `build:watch` - interactive watch mode to automatically transpile source files,
- `lint` - lint source files and tests,
- `test` - run tests,
- `test:watch` - interactive watch mode to automatically re-run tests,
- `migrate` - Create, up, down DB migrations,
- `seed` - Create, up, down seeding migrations, --> In case of error try adding `-- --no-check-order` at the end
- `db-setup` - run both DB and seeding migration --> only up

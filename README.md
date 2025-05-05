# boilerplate-express

## Manual Installation

If you would still prefer to do the installation manually, follow these steps:

Clone the repo:

```bash
git clone git@bitbucket.org:vodjo/boilerplate-express.git
cd boilerplate-express
```

Install the dependencies:

```bash
yarn install
```

Set the environment variables:

```bash
cp .env.example .env

# open .env and modify the environment variables (if needed)
```

## Running Apps

run mode development
```bash
yarn dev
```
run pm2 
```bash
yarn start
```

## Command

create model with migration
```bash
yarn model:create --name [name] --attributes=[column]:[datatype],[column]:[datatype]
```
create migration
```bash
yarn migration:create --name [name]
```
create seeder
```bash
yarn seed:create --name [name]
```
run migration
```bash
yarn migrate
```
run seeder
```bash
yarn seed
```
create secret key for jwt
```bash
yarn generate:key
```

## Documentation API

documentation api for core
```bash
https://baseURl/docs/core
```

documentation api for public
```bash
https://baseURl/docs/public
```

## Queue Monitor

```bash
https://baseURl/queue-monitor
```
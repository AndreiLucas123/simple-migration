# Simple Migration

A very tiny and simple migration manager for node and mysql

This library uses `mysql2`

It search `.sql` files in `/migrations` folder

Each `.sql` file has to be named `n-<migration-name>`

## CLI

You can call using `mig`, the argument is the migration folder

### CLI Notes: 

It uses `dotenv` to config the env variables using that variables

- DB_HOST
- DB_USER
- DB_PASSWORD
- DB_NAME

#### Examples

- 001-create_user
- 02-custumers_table
- 1002-remove_column_x

#### Obs

> The initial numbers will be sorted

# Simple Migration

A very tiny and simple migration manager for node and mysql

This library uses `mysql2`

It search `.sql` files in `/migrations` folder

Each `.sql` file has to be named `n-<migration-name>`

#### Examples

  - 001-create_user
  - 02-custumers_table
  - 1002-remove_column_x

#### Obs

The initial numbers will be sorted
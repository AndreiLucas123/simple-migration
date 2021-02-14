# Simple Migration

A very tiny and simple migration manager for node and mysql

It search `.sql` files in `/migrations` folder

Each `.sql` file has to be named `n-<migration-name>`

#### Examples

  - 001-create_user
  - 02-custumers_table
  - 1002-remove_column_x
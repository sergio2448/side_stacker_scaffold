# 🎮 Side Stacker Game 🎮

## 🗒️ How to install and run tests
The project is mounted with Docker and thus, to install it you should just use basic docker-compose commands.

1. Clone this repository
2. Build the container: `docker-compose build`
3. Run it: `docker-compose up -d`
4. Run migrations (The container must be running): `docker-compose exec --workdir=/app backend pw_migrate migrate`
5. Run the backend tests (The container must be running): `docker-compose exec backend pytest -sv`
6. Run the frontend tests (The container must be running): `docker-compose exec --workdir=/app frontend yarn test_docker`
7. You can run `docker-compose exec <(frontend|backend)> bash` to have a shell inside the container.
8. Example to run a single test:  `docker-compose exec backend pytest -sv src/tests/test_controller.py::test_player_in_turn`
9. Then to play it you just have to go to `http://localhost:3000` in your browser (Requires the container running)

## Adding frontend packages when running with Docker

After you've installed a frontend package i.e. by adding it to `package.json` or with `yarn add <packagename>`,
it should be automatically updated inside your running Docker container. In case it doesn't you can run make sure it's updated in docker by running `docker-compose exec --workdir=/app frontend yarn install` manually, or just rebuild the container

## Migrations note

Backend uses migrations to set up a database. 

For manual run, 

`PYTHONPATH=/Users/firfi/work/clients/monadical/side_stacker_scaffold/backend/:$PYTHONPATH pw_migrate migrate`

or in Docker

`docker-compose exec --workdir=/app backend pw_migrate migrate`

ORM is [peewee](http://docs.peewee-orm.com/en/latest/).

[peewee_migrate](https://github.com/klen/peewee_migrate) is used for migrations.

To add a migration, 

`PYTHONPATH=/Users/firfi/work/clients/monadical/side_stacker_scaffold/backend/:$PYTHONPATH pw_migrate create <migration-name>`

or in Docker

`docker-compose exec --workdir=/app backend pw_migrate create <migration-name>`

# Scaffold Checklist (if candidate, skip this)

- must accommodate both JS and TS on frontend
- user changes db schema
- user wants to access db with a db management tool
- user adds a frontend lib
- user adds a backend lib
- users changes frontend code
- user changes backend code
- user changes db
- TODO check pre-commit-config.yaml for python

# Troubleshooting

If yarn build in Docker is stuck at "Building fresh packages", it's likely some network issue. Restarting it might help.
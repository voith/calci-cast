# Calculator Chat App

This is a simple Django application that logs calculations made by a user and shares it will all the users connected to the website(using websockets) in real-time. This application has been built using [Django Channels](http://channels.readthedocs.org/en/latest/). .

## Running locally

To run this app locally, you'll need Python, Postgres, and Redis. 

Then, to run:

- Install requirements: `pip install -r requirements.txt` (you almost certainly want to do this in a virtualenv).
- Migrate: `DATABASE_URL=postgres:///... python manage.py migrate`
-  set `DATABASE_URL` and `REDIS_URL` in your environ, then run `python manage.py runserver`.
- to run locally with multiple proceses by setting the environ, then running the two commands (`daphne` and `runworker`) as shown in the `Procfile`.

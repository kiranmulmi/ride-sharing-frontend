# Ride Sharing App (Frontend)

This is ride sharing app frontend in React JS
## Dependencies
- Docker Environment
- Google Map Api Key
- Map API key should have `places` library access

## Environment setup

Create `.env` file on root folder and add following values
```sh

# API Server URL eg: http://localhost:4000
REACT_APP_API_URL="some url"

# Google Map Api key
REACT_APP_GOOGLE_MAP_API_KEY="some key"

```
Note: you can take the reference from `.env.example` file

## Run the App
Run the following docker compose command to build and run the app
```sh
docker-compose up -d --build
```

## API Documentation
https://documenter.getpostman.com/view/10187762/2s83zmMNN1


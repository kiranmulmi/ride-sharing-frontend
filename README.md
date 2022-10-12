# Ride Sharing App

This is ride sharing app

## Environment setup

Create `.env` file on root folder and add following values
```
# Envrironment configuration

REACT_APP_API_URL=<Backend API Url>
REACT_APP_GOOGLE_MAP_API_KEY=<google api key>
```
Note: you can take the reference from `.env.example` file

## Build Docker Image
`docker build . -t ride-sharing-frontend`

## Run the image in detached mode
`docker run -p 3000:3000 -d ride-sharing-frontend`


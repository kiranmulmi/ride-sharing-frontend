# Ride Sharing App

This is ride sharing app

## Environment setup

Create `.env` file on root folder and add following values
```
# Envrironment configuration

REACT_APP_API_URL=<Backend API Url, eg: http://localhost:4000>
REACT_APP_GOOGLE_MAP_API_KEY=<google api key>
```
Note: you can take the reference from `.env.example` file

### Build Docker Image
`docker build . -t ride-sharing-frontend:dev`

### Run the image in detached mode
`docker run -p 3000:3000 -d ride-sharing-frontend:dev`

docker run -it --rm -v ${PWD}:/app -v /app/node_modules -p 3000:3000 -e CHOKIDAR_USEPOLLING=true ride-sharing-frontend:dev


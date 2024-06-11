### Prerequisite
Assumed that you have `docker` and `docker-compose` installed.

### Setup
Before start set your API key in the `docker-compose.yaml` file 
To start an app use a command:
```shell
docker-compose up --build
```

### Endpoints 

1) returns an acoin history fro the period, with day interval  
   url: `/history/:id?from=2024-01-01T00:00:00.000Z&to=2024-01-02T00:00:00.000Z`
   test command: 
   ```shell
   curl --location 'http://localhost:3000/coin/history/DOGE?from=2024-06-09T12%3A50%3A26.405Z&to=2024-06-11T12%3A50%3A26.405Z'
   ```

2) returns real time data about a coin at the moment of request  
   url: `coin/rt/:id`
   test command: 
   ```shell
   curl --location 'http://localhost:3000/coin/rt/BTC'
   ```

3) returns list of all supported coins
   url: `coin/list`
   test command: 
   ```shell
   curl --location 'http://localhost:3000/coin/list'
   ```
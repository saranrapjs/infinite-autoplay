# infinite autoplay

This is a very early experiment with a rig which follows the youtube autoplay algorithm along, logging newly-loaded URL's as it goes.

## running

You'll need to install selenium server — I've set this up via Docker:

```
docker-compose up selenium
```

Running like this will persist to a CSV file, used to start where you've left off if you stop:

```
node index.js log.csv >> log.csv
```

This will also log to stderr.

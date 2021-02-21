# zartisp1

## Test
For launching tests execute `nmp test`

In api tests sinon is used for mocking GarageService methods which allows testing without  needing
to startup a mongodb server.

## Executing development instance with embedded mongodb

`node .\test\appdev.mjs`

## Executing development instance with external mongodb

1. Set environment variable MONGODB_URL with mongodb URL  
2. Execute `node app.mjs`


## Implementation

It is a service that allows to store vehicles and fueling

The code is split in 2 main component:
- Rest API under /api folder
- Garage Service under /services folder

For the sake of simplicity a small set of features haven developed that allow to demonstrate
some testing technics.

Rest API only implements:
- Find all vehicles
- Get vehicle by ID
- Upload multiple vehicles

### Upload files

For an efficient upload of vehicles  the content format [ndjson](https://github.com/ndjson/ndjson-spec) is used
with this format it is possible to handle objects as they are read from request the input stream

A real usage in a product can be found in Elastic search [bulk api](https://www.elastic.co/guide/en/elasticsearch/reference/current/docs-bulk.html)

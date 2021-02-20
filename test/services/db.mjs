import mongounit from 'mongo-unit';
import fs from 'fs';

const db = {
    async start() {
        process.env.MONGODB_URL = await mongounit.start();
    },

    async loadData() {
        let vehicleRawData = fs.readFileSync('./test/services/data/vehiclesData.json');
        let vehicleParsedData = JSON.parse(vehicleRawData);
        let loadResult = await mongounit.load(vehicleParsedData);
        db.vehicles = loadResult[0].ops;

        let fuelingRawData = fs.readFileSync('./test/services/data/fuelingData.json');
        let fuelingParsedData = JSON.parse(fuelingRawData);
        for (let fueling of fuelingParsedData.fuelings) {
            fueling.vehicle = db.vehicles[fueling.vehicle]._id;
        }
        await mongounit.load(fuelingParsedData);
    },

    async drop() {
        await mongounit.drop();
    },

    async stop() {
        await mongounit.stop();
    }
}

export default db;
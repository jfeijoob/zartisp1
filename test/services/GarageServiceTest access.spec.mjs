import { expect } from 'chai';
import db from './db.mjs';
import garageService from '../../services/GarageService.mjs';

let vehicles;

describe( 'TodoService access operations',
    () => {
        before(
            async function () {
                await db.loadData();
                vehicles = db.vehicles;
            }
        );
        after( async function(){
            await db.drop();
        } );

        it('Find All Vehicles', async function () {
            let vehicles = await garageService.findAllVehicles();
            expect(vehicles.length).to.equal(2);
            expect(vehicles[0].name).to.equal('Peugeot 308 SW');
        });

        it('Find a vehicle by its id', async function () {
            let vehicle = await garageService.findVehicleById( vehicles[0]._id );
            expect(vehicle._id.toString()).to.equal(vehicles[0]._id.toString());
            expect(vehicle.name).to.equal(vehicles[0].name);
        });

        it('Find Vehicles by Id', async function () {
            // toString is used because when different ObjectID instances the comparison is false even if they contain the same ID.
            let vehicleIds = vehicles.map( (item) => item._id.toString() );
            let foundVehicles = await garageService.findVehiclesById( vehicleIds );
            expect(foundVehicles.length).to.equal(2);
            for( let i = 0; i < vehicleIds.length; i++ ){
                expect(vehicleIds).to.be.an('array').that.includes(foundVehicles[i]._id.toString());
            }
        });

        it('Find All Fueling with no vehicle information', async function () {
            let fuelings = await garageService.findAllFuelings();
            expect(fuelings.length).to.equal(4);
            expect(fuelings[0].vehicle.name).to.be.undefined;
        });

        it('Find All Fueling with vehicle information', async function () {
            let fuelings = await garageService.findAllFuelings( true );
            expect(fuelings.length).to.equal(4);
            expect(fuelings[0].vehicle.name).to.equal('Peugeot 308 SW');
        });
    }
)

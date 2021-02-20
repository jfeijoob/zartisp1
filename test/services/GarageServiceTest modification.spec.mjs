import mongoose from 'mongoose';
import { expect } from 'chai';
import db from './db.mjs';
import garageService from '../../services/GarageService.mjs';

let vehicles;

describe( 'TodoService modification operations',
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

        it('Create a vehicle', async function () {
            let vehicle = await garageService.createVehicle( { "name": "Opel Astra" } );
            let vehicleFound = await garageService.findVehicleById( vehicle.id );
            expect(vehicle.id).to.not.be.undefined;

            expect(vehicle._id.toString()).to.equal(vehicleFound._id.toString());
            expect(vehicle.name).to.equal(vehicleFound.name);
        });

        it('Create Multiple vehicles', async function () {
            let opelCorsa1Id = new mongoose.Types.ObjectId();
            let opelCorsa2Id = new mongoose.Types.ObjectId();
            let vwGolf5Id = new mongoose.Types.ObjectId();

            let vehicles = await garageService.createManyVehicle([
                { "name": "VW Golf 5"   },
                { "name": "Opel Corsa 2"},
                { "name": "Opel Corsa 1" }
            ]);

            let vehicleIds = vehicles.map( (item) => item.id );

            let foundVehicleIds = (await garageService.findVehiclesById( vehicleIds )).map( (item) => item.id );

            expect(foundVehicleIds).to.include.members(vehicleIds);
        });

        it('Create Multiple vehicles except the ones with errors', async function () {
            let duplicateId1 = new mongoose.Types.ObjectId();
            let duplicateId2 = new mongoose.Types.ObjectId();
            let opelCorsa1Id = new mongoose.Types.ObjectId();
            let opelCorsa2Id = new mongoose.Types.ObjectId();
            let vwGolf5Id = new mongoose.Types.ObjectId();

            let vehicles1 = await garageService.createManyVehicle([
                { "_id": duplicateId1, "name": "VW Golf 1"    },
                { "_id": duplicateId2, "name": "VW Golf 2"    },
                { "_id": opelCorsa1Id, "name": "Opel Corsa 1" }
            ]);

            try {
                let vehicles2 = await garageService.createManyVehicle([
                    { "_id": vwGolf5Id   , "name": "VW Golf 5"   },
                    { "_id": duplicateId1, "name": "VW Golf 3"   },
                    { "_id": opelCorsa2Id, "name": "Opel Corsa 2"},
                    { "_id": duplicateId2, "name": "VW Golf 4"   }
                ]);
            }catch ( e ){
                expect( e.writeErrors.length ).to.equal(2);
                expect( e.writeErrors[0].err.index ).to.equal(1);
                expect( e.writeErrors[1].err.index ).to.equal(3);
            }

            // toString is used because when different ObjectID instances the comparison is false even if they contain the same ID.

            let vehicleIds = [ duplicateId1, duplicateId2, opelCorsa1Id, opelCorsa2Id, vwGolf5Id ].map( (item) => item.toString() );

            let foundVehicleIds = (await garageService.findVehiclesById( vehicleIds )).map( (item) => item.id );

            expect(foundVehicleIds).to.include.members(vehicleIds);
        });

        it('Delete a vehicle', async function () {
            await garageService.deleteVehicleById( vehicles[0]._id.toString() );
            let vehicle = await garageService.findVehicleById( vehicles[0]._id.toString() );
            let fueling = await garageService.findVehicleById( vehicles[0]._id.toString() );
            expect(vehicle).to.be.null;
            expect(fueling).to.be.null;
        });

        it('Add Fuel to a vehicle by its id', async function () {
            let fueling = await garageService.addFueling( vehicles[1]._id, {
                liters: 10,
                literPrice: 1.2,
                date: Date.now(),
                amount: 12,
                odometer: 100000
            } );
            expect(fueling.id).to.not.be.undefined;
            expect(fueling.vehicle._id.toString()).to.equal(vehicles[1]._id.toString());
        });

    }
)

import mongoose from 'mongoose';
import FuelingSchema from '../models/Fueling.mjs';
import VehicleSchema from '../models/Vehicle.mjs';


class GarageService {
    async init(){
        await mongoose.connect(process.env.MONGODB_URL);
        this.VehicleModel = mongoose.model( 'Vehicle', VehicleSchema );
        this.FuelingModel = mongoose.model( 'Fueling', FuelingSchema );
    }

    async findAllVehicles(){
        return await this.VehicleModel.find();
    }

    async findVehiclesById( ids ){
        return await this.VehicleModel.find( {
            '_id': {
                $in: ids
            }
        } );
    }

    async findVehicleById( vehicleId ){
        return await this.VehicleModel.findById( vehicleId );
    }

    async findAllFuelings( vehicle=false ){
        const result = this.FuelingModel.find();
        if( vehicle )
            result.populate('vehicle');
        return await result;
    }

    async findAllFuelingsByVehicleId(  vehicle=false, vehicleId ){
        const result = this.FuelingModel.find( { vehicle:vehicleId } );
        if( vehicle )
            result.populate('vehicle');
        return await result;
    }

    async createManyVehicle( vehicles ){
        return await this.VehicleModel.insertMany( vehicles, {ordered:false} );
    }

    async createVehicle( vehicle ){
        return await this.VehicleModel.create( vehicle );
    }

    async deleteVehicleById( vehicleId ){
        /*
        For transactions support a ReplicaSet is needed, the current library being used for unit testing only supports to start standalone mongodb instance.
        The alternative would be to use directly https://github.com/nodkz/mongodb-memory-server library rather than the wrapper https://github.com/mikhail-angelov/mongo-unit
        The advantage of mongo-unit is that it offers some out of the box features like loading example data, default options...

        await mongoose.connection.transaction( async function ( session ){
            await this.VehicleModel.deleteOne( {_id:vehicleId}, {session} );
            await this.FuelingModel.deleteOne( {vehicle:vehicleId}, {session} );
        }.bind(this) );

         */

        await this.VehicleModel.deleteOne( {_id:vehicleId} );
        await this.FuelingModel.deleteOne( {vehicle:vehicleId} );
    }


    async addFueling( vehicleId, fueling ){
        return await this.FuelingModel.create( {
            vehicle: vehicleId,
            ...fueling
        } );
    }

}

export default new GarageService();


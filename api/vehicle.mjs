import express from 'express';
import ndjson from 'ndjson';
import garageService from '../services/GarageService.mjs';
import {expect} from "chai";

const router = express.Router();

function buildHandler( fn ){
    return async function caller(req, res, next) {
        try {
            await fn( req,res,next );
        } catch (error) {
            next(error);
        }
    };
}

async function findAllVehicles(req, res, next) {
    let vehicles = await garageService.findAllVehicles();
    if (vehicles?.length === 0) {
        res.status(204);
        vehicles = [];
    }
    res.send(vehicles);
}
/*
*
* Create Many Vehicles
*
* It is split in 2 parts, the first one iterates the vehicles by consuming them from the Input Stream and the second one
* has the logic for error handling
*
* For keeping spacial complexity low the request body is read and written by chunks.
* We try to create as many vehicles as possible and we track those vehicles that have got some error when creating them.
* In case of many errors, as we are keeping track of all failed documents, it can lead us to a high memory consumption so
* when a certain threshold of failed documents a too 'many errors' error is thrown
*
* */

async function _createManyVehicles( vehicles, status ){
    try {
        const result = await garageService.createManyVehicles(vehicles);
        status.created += result.length;
    }catch( e ){
        const errors = [];
        if( e.writeErrors ){
            for(const writeError of e.writeErrors ){
                const error = {
                    vehicle: vehicles[writeError.err.index],
                    message: writeError.err.errmsg
                }
                errors.push(error);
            }
            if( !status.errors ) status.errors = [];

            status.errors = status.errors.concat( errors );
            status.skipped += errors.length;
            status.created += e.result.result.nInserted;
        }else{
            throw e;
        }
    }

    if( status.skipped > 5 ){
        const e = new Error( 'Too many vehicles with errors' );
        e.info = status;
        throw e;
    };
}

async function createManyVehicles(req, res, next) {

    const contentType = req.get('content-type');
    if( contentType !== 'application/x-ndjson' ) {
        const error = new Error('Unsupported content type');
        error.status = 400;
        throw error;
    }

    let status = {
        created: 0,
        skipped:0
    };

    const vehicles = req.pipe(ndjson.parse());
    let vehiclesBuffer = [];
    for await ( const vehicle of vehicles ){
        vehiclesBuffer.push( vehicle );
        if(vehiclesBuffer.length > 49 ){
            await _createManyVehicles( vehiclesBuffer, status );
            vehiclesBuffer = [];
        }
    }

    if(vehiclesBuffer.length > 0 ){
        await _createManyVehicles( vehiclesBuffer, status );
    }

    if( status.skipped > 0 ){
        const e = new Error( 'Errors creating vehicles' );
        e.info = status;
        throw e;
    };

    res.send( status );
}

/*
*
* Find Vehicle by ID
*
* */

async function findVehicleById(req, res, next) {
    let vehicle = await garageService.findVehicleById(req.params.id);
    if (!vehicle) {
        res.status(204);
        vehicle = {};
    }
    res.send(vehicle);
}


router.get('/', buildHandler(findAllVehicles) );
router.post('/', buildHandler(createManyVehicles) );
router.get('/:id', buildHandler(findVehicleById) );

export default router;
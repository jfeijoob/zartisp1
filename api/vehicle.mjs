import mongoose from 'mongoose';
import express from 'express';
import garageService from '../services/GarageService.mjs';

var router = express.Router();

router.get( '/', async function (req, res, next){
    let vehicles = await garageService.findAllVehicles();
    if( vehicles?.length == 0 ) {
        res.status(204);
    }
    res.send( vehicles );
} );

export default router;
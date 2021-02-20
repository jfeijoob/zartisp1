import db from './db.mjs';
import garageService from '../../services/GarageService.mjs';

export async function mochaGlobalSetup() {
    await db.start();
    await garageService.init();
    console.log('mongodb started!');
};
import vehicleRouter from './vehicle.mjs';
import express from 'express';
const app = express();

app.use(express.json());

app.use( '/vehicles', vehicleRouter );
app.listen( 8080 );
console.log( 'Server is up' );

export default app;

import createError from 'http-errors';
import vehicleRouter from './vehicle.mjs';
import express from 'express';
const app = express();

app.use(express.json());

app.use( '/vehicles', vehicleRouter );

// Default route generates HTTP 404 not found
app.use(function(req, res, next) {
    next(createError(404));
});

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send(err);
});


const httpServer = app.listen( 8080 );
console.log( 'Server is up' );

export { app as api, httpServer };

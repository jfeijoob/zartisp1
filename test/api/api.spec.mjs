import ndjson from 'ndjson';
import garageService from '../../services/GarageService.mjs';
import { api, httpServer} from '../../api/api.mjs';
import request from 'supertest';
import sinon from 'sinon';

async function generateVehicleTests(){
    let vehicles = '';
    const serializer = ndjson.stringify();

    for( let i = 0; i < 101; i++ ){
        serializer.write({
            "name": `Vehicle ${i}`
        });
    }
    serializer.end();

    for await ( const vehicle of serializer ){
        vehicles += vehicle;
    }

    return vehicles;
}

describe('Rest API Test', () => {

    after( async function(){
        httpServer.close();
    } );

    it('Find all vehicles', async () => {
        sinon.stub(garageService, 'findAllVehicles').
        returns([{
                name: 'vehicle 1',
            },
            {
                name: 'vehicle 2',
            }]
        );
        await request(api).get('/vehicles').expect(200).expect('Content-Type', /json/);
        sinon.restore();
    });

    it('Find all vehicles with Error 500', async () => {
        sinon.stub(garageService, 'findAllVehicles').throws( new Error( 'Error finding vehicles' ) );
        await request(api).get('/vehicles').expect(500).expect('Content-Type', /json/);
        sinon.restore();
    });

    it('Create Multiple Vehicles', async () => {
        let vehicles = await generateVehicleTests();

        sinon.stub(garageService, 'createManyVehicles').returns([{name:'test vehicle'}]);
        await request(api).post('/vehicles')
            .send(vehicles)
            .set('Content-Type', 'application/x-ndjson')
            .expect(200).expect('Content-Type', /json/);
        sinon.restore();
    });


    it('Create Multiple Vehicles with wrong content type', async () => {
        let vehicles = await generateVehicleTests();

        sinon.stub(garageService, 'createManyVehicles').returns([{name:'test vehicle'}]);
        await request(api).post('/vehicles')
            .send(vehicles)
            .set('Content-Type', 'some content type')
            .expect(400).expect('Content-Type', /json/);
        sinon.restore();
    });

    it('Create Multiple Vehicles with wrong body format', async () => {
        let vehicles = await generateVehicleTests();

        sinon.stub(garageService, 'createManyVehicles').returns([{name:'test vehicle'}]);
        await request(api).post('/vehicles')
            .send(`
            {"name": "vehicle name"}
            {"name": "malformed json}
            `)
            .set('Content-Type', 'application/x-ndjson')
            .expect(500).expect('Content-Type', /json/);
        sinon.restore();
    });

});


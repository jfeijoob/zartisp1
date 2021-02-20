import api from '../../api/api.mjs';
import request from 'supertest';
describe( 'Rest API Test', () => {
    it( 'Find all vehicles', async () => {
        await request(api).
                get('/vehicles').
                expect('Content-Type', /jsosn/);
    } );
} );


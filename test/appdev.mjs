import cluster from 'cluster';
import os from 'os';
import db from './services/db.mjs';


if (cluster.isMaster) {
    await db.start();
    await db.loadData();
}
import( '../app.mjs' );
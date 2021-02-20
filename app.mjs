import garageService from './services/GarageService.mjs';
import cluster from 'cluster';
import os from 'os';


if (cluster.isMaster) {
    // set cluster policy
    cluster.schedulingPolicy = cluster.SCHED_NONE;
    // Start workers
    var cpuCount = os.cpus().length;
    for (var i = 0; i < cpuCount; i++) {
        cluster.fork();
    }
} else {
    await garageService.init();
    await import( './api/api.mjs' );
}
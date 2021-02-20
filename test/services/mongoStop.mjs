import db from './db.mjs';

export async function mochaGlobalTeardown() {
    await db.stop();
    console.log('mongodb stopped!');
};
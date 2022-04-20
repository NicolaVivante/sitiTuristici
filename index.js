import { init, getDBManager, getAuthManager, getStorageManager, getFirebaseDBManager } from "./website/init.js";

function dumpDB(db) {
    const outdump = document.getElementById("dump-db");
    outdump.innerHTML = JSON.stringify(db, null, 2);
}

init();
const dbManager = getDBManager();
const fdbManager = getFirebaseDBManager();
const authManager = getAuthManager();
const storageManager = getStorageManager();
dbManager.onDBChange(dumpDB);

let id = "-N-bSnXf0YkX73JOB9Nn";
let location = await dbManager.getLocation(id, false, false);
await fdbManager.setLocation(id, location);
//await fdbManager.removeLocation(id);
let fLocation = await fdbManager.getLocation(id, true, true);
console.log(fLocation);

// let a = await fdbManager.addLocation(location);
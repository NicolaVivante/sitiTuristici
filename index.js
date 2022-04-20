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

let a = await fdbManager.addLocation(location);
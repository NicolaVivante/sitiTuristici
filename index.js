import { init, getDBManager, getAuthManager, getStorageManager, getFirebaseDBManager } from "./website/init.js";

init();
const dbManager = getDBManager();
const fdbManager = getFirebaseDBManager();
const authManager = getAuthManager();
const storageManager = getStorageManager();

// let id = "-N-bSnXf0YkX73JOB9Nn";
// let location = await dbManager.getLocation(id, false, false);
// await fdbManager.setLocation(id, location);
// await fdbManager.removeLocation(id);
// let fLocation = await fdbManager.getLocation(id, true, true);
// console.log(location);
// console.log(fLocation);

//let a = await fdbManager.addLocation(location);
//console.log(a);
storageManager.downloadFile();
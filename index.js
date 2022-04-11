import { DBManager } from "./DBManager.js";
import { Location } from "./location.js";
import { RealtimeDBManager } from "./realtimeDBManager.js";

const firebaseConfig = {
    apiKey: "AIzaSyDm5EynX5GYeJXF7VWZBO3IY0vjjRPl_hA",
    authDomain: "sitituristicitest.firebaseapp.com",
    databaseURL: "https://sitituristicitest-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "sitituristicitest",
    storageBucket: "sitituristicitest.appspot.com",
    messagingSenderId: "1028951298732",
    appId: "1:1028951298732:web:4ffebc2c94d2ff9d59c509"
};

function renderLocations(locations) {
    for (let locationId in locations) {
        // actually render the location and update html page
        let location = locations[locationId];
        Object.setPrototypeOf(location, Location.prototype)
        console.log(`Name: "${location.name}", Average score: ${location.getAvgScore()}`);
    }
}

function dumpDB(db) {
    const outdump = document.getElementById("dump-db");
    outdump.innerHTML = JSON.stringify(db, null, 2);
}

let dbManager = new RealtimeDBManager(firebaseConfig);
dbManager.onDBChange(dumpDB);
dbManager.onLocationsChange(renderLocations);

let piazza = new Location("piazza", "{}");
piazza.addReview(4.5);
let id = dbManager.addLocation(piazza);
let location = await dbManager.getLocation(id);
dbManager.removeLocation(id);
console.log(location);

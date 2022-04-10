// documentazione
// https://firebase.google.com/docs/database/web/read-and-write

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.9/firebase-app.js";
import { getDatabase, ref, child, onValue, push } from "https://www.gstatic.com/firebasejs/9.6.9/firebase-database.js";
import { Location } from "./test.js";

const firebaseConfig = {
    apiKey: "AIzaSyDm5EynX5GYeJXF7VWZBO3IY0vjjRPl_hA",
    authDomain: "sitituristicitest.firebaseapp.com",
    databaseURL: "https://sitituristicitest-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "sitituristicitest",
    storageBucket: "sitituristicitest.appspot.com",
    messagingSenderId: "1028951298732",
    appId: "1:1028951298732:web:4ffebc2c94d2ff9d59c509"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// get realtime database reference
// self. to let db be global from other modules
self.db = getDatabase(app);

function onGetAllLocations(callBack) {
    let locationsRef = ref(db, 'locations');
    onValue(locationsRef, (locations) => callBack(locations.val()));
}

function displayLocations(locations) {
    const locationsJSON = JSON.stringify(locations);
    const output1 = document.getElementById("id01");
    output1.innerHTML = locationsJSON;
    for (let locationId in locations) {
        // actually render the location
        console.log(locationId + " --> " + locations[locationId]);
    }
}

function addLocation(location) {
    let locationsRef = ref(db, 'locations');
    locationsRef.push().set(JSON.stringify(location));
}

onGetAllLocations(displayLocations);
let newLocation = new Location("piazza", "sis");
addLocation(newLocation);

// recupera e stampa tutto il database in json
const outdump = document.getElementById("dump-db");
let dbRef = ref(db);
onValue(dbRef, snap => {
    outdump.innerHTML = JSON.stringify(snap.val(), null, 2);
});  
// documentazione
// https://firebase.google.com/docs/database/web/read-and-write

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.9/firebase-app.js";
import { getDatabase, ref, get, child, onValue } from "https://www.gstatic.com/firebasejs/9.6.9/firebase-database.js";

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
// get realtyme databse reference
// self. to let firebase be global from other modules
self.firebase = getDatabase(app);
const dbRef = ref(firebase);

function getAllLocations(locationsArray) {
    let locationsRef = child(ref(firebase), 'locations');
    onValue(locationsRef, (locations) => {
        locations.forEach((location) => {
            locationsArray.push(location.val());
        });
    });
}

function arrayToJson(array) {
    let jsonArray = {};
    console.log(array.length);
    for (let i = 0; i < array.length; i++) {
        console.log(i);
    }
}

const output1 = document.getElementById("id01");
let allLocations = [];
getAllLocations(allLocations);
let arraySize = allLocations.length;
console.log(allLocations);
console.log(allLocations.length);
console.log(arraySize);
output1.innerHTML = JSON.stringify(allLocations);

// recupera e stampa tutto il database in json
const outdump = document.getElementById("dump-db");
let dbRef2 = ref(firebase);
onValue(dbRef2, snap => {
    outdump.innerHTML = JSON.stringify(snap.val(), null, 2);
});  
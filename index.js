import { Review } from "./review.js";
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
        let locationJSON = locations[locationId];
        //Object.setPrototypeOf(location, Location);
        let location = new Location()
        Object.assign(location, locationJSON);
        console.log(`Name: "${location.name}", Average score: ${location.getAvgScore()}`);
    }
}

function dumpDB(db) {
    const outdump = document.getElementById("dump-db");
    outdump.innerHTML = JSON.stringify(db, null, 2);
}

const dbManager = new RealtimeDBManager(firebaseConfig);
dbManager.onDBChange(dumpDB);

let location = new Location("castello di Brescia", { lat: -34.397, lng: 150.644 });
location.addContact("un contatto");
location.addDescription("Il castello, fondato nel 200 a. C., è molto bello");
// let locationId = dbManager.addLocation(location);
let locationId = "-N-bSnXf0YkX73JOB9Nn";

import { AuthenticationManager } from "./authenticationManager.js";

self.authManager = new AuthenticationManager(dbManager);

let name = "amogosus1";
let email = "test1.test@test.com";
let password = "password";

//console.log(authManager.getCurrentUser()); // null before login / registration

//await authManager.register(name, email, password);
await authManager.login(email, password);

let review = new Review(locationId, authManager.getCurrentUser().uid, "Scarso", 3);
let reviewId = await dbManager.addReview(review);

let locationGet = await dbManager.getLocation(locationId, true, true);
//console.log(locationGet);

await dbManager.removeReview(reviewId);
// await dbManager.removeLocation(locationId);

//console.log(authManager.getCurrentUser());


// MEDIA UPLOAD TEST

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.9/firebase-app.js";
import { getStorage, ref, uploadBytes } from "https://www.gstatic.com/firebasejs/9.6.9/firebase-storage.js";


const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);


function uploadMedia(path, file) {

    const storageRef = ref(storage, path + "/" + file.name);
    console.log(storageRef);

    // 'file' comes from the Blob or File API
    uploadBytes(storageRef, file).then((snapshot) => {
        console.log('Uploaded a blob or file!');
        console.log(snapshot.ref.fullPath);
    }).catch((error) => {
        const errorCode = error.errorCode;
        const errorMessage = error.message;
        console.log(errorMessage + ", " + errorCode);
    });
}


const fileSelector = document.getElementById('file-selector');
fileSelector.addEventListener('change', (event) => {
    const fileList = event.target.files;
    console.log(fileList);
    uploadMedia(authManager.getCurrentUser().uid, fileList[0]);
});

function getMediaUrl(path) {

}
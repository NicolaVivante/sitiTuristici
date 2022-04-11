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

let dbManager = new RealtimeDBManager(firebaseConfig);
dbManager.onDBChange(dumpDB);

let piazza = new Location("piazza", { lat: -34.397, lng: 150.644 });
//piazza.addReview(4.5);
// let id = dbManager.addLocation(piazza);
// let location = await dbManager.getLocation(id);
// dbManager.removeLocation(id);
// let allLocations = await dbManager.getAllLocations();
// console.log(location);
let id = "-N-MtRivi1SeXGvDdcBU";
let review = new Review(id, "userId", "Ottimo", 4);
let reviewId = await dbManager.addReview(review);
await dbManager.removeReview(reviewId);

let locationWith = await dbManager.getLocation(id, true);
let locationWithout = await dbManager.getLocation(id, false);
let allLocations = await dbManager.getAllLocations();
let allReviews = await dbManager.getAllReviews();
// console.log(locationWith);
// console.log(locationWithout);
// console.log(allLocations);
let allLocationsCopy = allLocations.slice(0, allLocations.length);
dbManager.orderLocationsByReviewsCount(allLocationsCopy, true);
console.log(allLocationsCopy);
// let allLocationsCopy1 = allLocations.slice(0, allLocations.length);
// dbManager.orderLocationsByLetter(allLocationsCopy1, true);
// console.log(allLocationsCopy1);
console.log(allReviews);

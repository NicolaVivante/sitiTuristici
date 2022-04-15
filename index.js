import { Review } from "./review.js";
import { Location } from "./location.js";
import { init, getDBManager, getAuthManager, getStorageManager } from "./website/init.js";

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

init();
const dbManager = getDBManager();
const authManager = getAuthManager();
const storageManager = getStorageManager();
dbManager.onDBChange(dumpDB);


let name = "amogosus1";
let email = "test1.test@test.com";
let password = "password";

//await authManager.register(name, email, password);
await authManager.login(email, password);


// let location = new Location("piazza Loggia", { lat: -34.197, lng: 130.644 });
// location.addDescription("Una piazza spaziosa, per tutte le occasioni");
// let locationId = dbManager.addLocation(location);
// let review = new Review(locationId, authManager.getCurrentUser().uid, "Non male", 4.5);
// let reviewId = await dbManager.addReview(review);
// await dbManager.removeReview(reviewId);
// await dbManager.removeLocation(locationId);

// MEDIA UPLOAD TEST

const fileSelector = document.getElementById('file-selector');
fileSelector.addEventListener('change', (event) => {
    const fileList = event.target.files;
    console.log(fileList);
    storageManager.uploadUserImage(authManager.getCurrentUser().uid, fileList[0]);
});


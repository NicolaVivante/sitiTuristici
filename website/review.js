import * as Utils from "./utils.js";
import { init, getDBManager, getStorageManager } from "./init.js";

init();
const dbManager = getDBManager();
const storageManager = getStorageManager();

const homeButton = document.getElementById("toHomeButton");
const titleEl = document.getElementById("title");
const scoreEl = document.getElementById("score");
const dateEl = document.getElementById("date");

const userEl = document.getElementById("user");
const usernameEl = document.getElementById("username");
const userImage = document.getElementById("userImg");

const locationEl = document.getElementById("location");
const locationNameEl = document.getElementById("locationName");

const descriptionEl = document.getElementById("description");
const mediaEl = document.getElementById("media");
let reviewId;

async function displayReview(review) {
    // render base properties
    titleEl.innerText = "Review title: " + review.title;
    scoreEl.innerText = "Review score: " + review.score;
    dateEl.innerText = "Date of review: " + Utils.timestampToDate(review.timestamp);

    locationEl.dataset.locationId = review.locationId;
    locationEl.onclick = Utils.toLocation;
    locationNameEl.innerText = "Location name: " + review.getLocation().name;

    userEl.dataset.userId = review.userId;
    userEl.onclick = Utils.toUserProfile;
    usernameEl.innerText = "By: " + review.getUser().name;
    userImage.src = await Utils.getUserImage(review.userId);
    userImage.style.width = "100px";

    // render optional properties
    if (review.getDescription() != undefined) {
        Utils.enableDisplay(descriptionEl, true);
        descriptionEl.innerText = "Description: " + review.getDescription();
    }

    let mediaURLs = await storageManager.getReviewMediaURLs(reviewId);
    if (mediaURLs != null) {
        for (let mediaURL of mediaURLs) {
            let imgEl = document.createElement("img");
            imgEl.src = mediaURL;
            imgEl.style.width = '300px';
            mediaEl.appendChild(imgEl);
        }
    }

}

// assign callbacks
homeButton.onclick = Utils.toHomePage;

// get id of review to display
reviewId = localStorage.getItem("reviewId");

// if review to display is not defined, back to home page
if (!reviewId || reviewId == "undefined") {
    Utils.toHomePage();
}

// get review
const review = await dbManager.getReview(reviewId, true, true);

// render review
displayReview(review);
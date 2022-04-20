import * as Utils from "./utils.js";
import { init, getDBManager, getAuthManager, getStorageManager } from "./init.js";
import { Review } from "../Review.js";

init();
const storageManager = getStorageManager();
const dbManager = getDBManager();
const authManager = getAuthManager();

const homeButton = document.getElementById("toHomeButton");
const locationNameEl = document.getElementById("locationName");
const reviewTitleEl = document.getElementById("reviewTitle");
const reviewScoreEl = document.getElementById("reviewScore");
const reviewDescriptionEl = document.getElementById("reviewDescription");
const reviewMediaEl = document.getElementById("reviewMedia");
const reviewForm = document.getElementById("reviewForm");
let userId;
let locationId;

// assign callbacks
homeButton.onclick = Utils.toHomePage;

reviewForm.onsubmit = async function (event) {
    event.preventDefault();

    const title = reviewTitleEl.value;
    const score = reviewScoreEl.value;
    const description = reviewDescriptionEl.value;
    let review = new Review(locationId, userId, title, score);
    if (description != "") {
        review.addDescription(description);
    }

    const reviewId = await dbManager.addReview(review);

    if (reviewMediaEl.files.length > 0) {
        for (let file of reviewMediaEl.files) {
            // upload file and get its URL
            await storageManager.uploadReviewMedia(reviewId, file);
            const mediaURL = (await storageManager.getReviewMediaURL(reviewId, file.name));
            review.addMedia(mediaURL);
        }
    }
    await dbManager.setReview(reviewId, review);
    Utils.toHomePage();
}

authManager.onLogStateChange(
    async function (user) {
        userId = user.uid;
        // get id of user to display
        locationId = localStorage.getItem("locationId");

        // if location to review is not defined, return to home page
        if (!locationId || locationId == "undefined") {
            Utils.toHomePage();
        }

        let location = await dbManager.getLocation(locationId, false, false);
        locationNameEl.innerText = "Reviewing: " + location.name;
    },
    () => {
        Utils.toHomePage();
    }
);




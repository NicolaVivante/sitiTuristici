import * as Utils from "./utils.js";
import { init, getDBManager } from "./init.js";

init();
const dbManager = getDBManager();

const homeButton = document.getElementById("toHomeButton");
const titleEl = document.getElementById("title");
const scoreEl = document.getElementById("score");
const dateEl = document.getElementById("date");
const userEl = document.getElementById("user");
const usernameEl = document.getElementById("username");
const userImage = document.getElementById("userImg");
const descriptionEl = document.getElementById("description");

function displayReview(review) {
    // render base properties
    titleEl.innerText = "Title: " + review.title;
    scoreEl.innerText = "Score: " + review.score;
    dateEl.innerText = "Date of review: " + Utils.timestampToDate(review.timestamp);
    userEl.id = review.userId;
    usernameEl.innerText = "User name: " + review.getUser().name;
    userImage.src = Utils.getUserImage(review.getUser());

    // render optional properties
    if (review.getDescription() != undefined) {
        Utils.enableDisplay(descriptionEl, true);
        descriptionEl.innerText = review.getDescription();
    }

}

// assign callbacks
homeButton.onclick = Utils.toHomePage;

// get id of review to display
const reviewId = localStorage.getItem("reviewId");

// if review to display is not defined, back to home page
if (reviewId == null) {
    Utils.toHomePage();
}

// get review
const review = await dbManager.getReview(reviewId, true, true);

// render review
displayReview(review);
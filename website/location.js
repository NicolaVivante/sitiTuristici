import * as Utils from "./utils.js";
import { init, getDBManager } from "./init.js";

init();
const dbManager = getDBManager();

const homeButton = document.getElementById("toHomeButton");
const nameEl = document.getElementById("name");
const avgScoreEl = document.getElementById("avgScore");
const revCountEl = document.getElementById("revCount");
const descriptionEl = document.getElementById("description");
const reviewsList = document.getElementById("reviewsList");
const reverseFilter = document.getElementById("reverseFilter");
const reviewFilters = document.getElementsByName("reviewFilter");

function renderReview(review) {
    let titleEl = document.createElement("div");
    titleEl.innerText = "Title: " + review.title;
    let scoreEl = document.createElement("div");
    scoreEl.innerText = "Score: " + review.score;
    let userEl = document.createElement("div");
    userEl.innerText = "User: " + review.getUser().name;
    let reviewEl = document.createElement("div");

    reviewEl.id = review.getId();
    reviewEl.onclick = toReview;
    reviewEl.appendChild(titleEl);
    reviewEl.appendChild(scoreEl);
    reviewEl.appendChild(userEl);
    reviewEl.appendChild(document.createElement("br"));

    return reviewEl;
}

function toReview(event) {
    // get the element that actually fired the event (location)
    let target = event.target;
    while (target.id == "") {
        target = target.parentNode;
    }

    // get location id and save it
    const reviewId = target.id;
    localStorage.setItem("reviewId", reviewId);

    console.log(reviewId);

    // redirect to location page
    Utils.redirect("./review.html");
}

function displayLocation(location) {
    // render base properties
    nameEl.innerText = "Name: " + location.name;
    avgScoreEl.innerText = "Average score: " + location.getAvgScore();
    revCountEl.innerText = "Number of reviews: " + location.reviewsCount;

    // render optional properties
    if (location.getDescription() != undefined) {
        Utils.enableDisplay(descriptionEl, true);
        descriptionEl.innerText = location.getDescription();
    }

    updateReviews();
}

function getReviewsFilter() {
    for (let filter of reviewFilters) {
        if (filter.checked) {
            return filter.value;
        }
    }
}

function updateReviews() {
    // get filter and reverse options
    const filter = getReviewsFilter();
    const reverse = reverseFilter.checked;

    let reviews = location.getReviews();

    // order the reviews
    switch (filter) {
        case "score":
            dbManager.orderReviewsByScore(reviews, reverse);
            break;
        case "date":
            dbManager.orderReviewsByTime(reviews, reverse);
            break;
        default:
            dbManager.orderReviewsByScore(reviews, false);
            console.log('no valid filter, sorting by score');
    }

    // clear reviewsList
    reviewsList.innerHTML = '';

    // render reviews
    for (let review of reviews) {
        let reviewEl = renderReview(review);
        reviewsList.appendChild(reviewEl);
    }
}

// assign callbacks
homeButton.onclick = Utils.toHomePage;

reviewFilters.forEach((filter) => {
    filter.onchange = updateReviews;
})
reverseFilter.onchange = updateReviews;


// get id of location to display
const locationId = localStorage.getItem("locationId");

// if location to display is not defined, back to home page
if (locationId == null) {
    Utils.toHomePage();
}

// get location
const location = await dbManager.getLocation(locationId, true, true);

// render location
console.log(location);
displayLocation(location);
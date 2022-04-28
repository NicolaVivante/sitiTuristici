import * as Utils from "./utils.js";
import { init, getDBManager, getAuthManager, getStorageManager } from "./init.js";

init();
const dbManager = getDBManager();
const authManager = getAuthManager();
const storageManager = getStorageManager();

const homeButton = document.getElementById("toHomeButton");
const nameEl = document.getElementById("name");
const avgScoreEl = document.getElementById("avgScore");
const revCountEl = document.getElementById("revCount");
const descriptionEl = document.getElementById("description");
const mediaEl = document.getElementById("media");
const reviewsList = document.getElementById("reviewsList");
const reverseFilter = document.getElementById("reverseFilter");
const reviewFilters = document.getElementsByName("reviewFilter");
const addReviewButton = document.getElementById("addReview");

async function renderReview(review) {

    let locationTemplate = document.getElementsByTagName("template")[0];
    let clone = locationTemplate.content.cloneNode(true);
    clone.querySelector('#title').innerText = review.title;
    clone.querySelector('#score').innerText = review.score;
    clone.querySelector('#userImage').src = await Utils.getUserImage(review.userId);
    clone.querySelector('#userImage').title = review.getUser().name;
    clone.querySelector('#date').innerText = Utils.timestampToDate(review.timestamp);

    clone.querySelector('#review').dataset.reviewId = review.getId();
    clone.querySelector('#review').onclick = Utils.toReview;

    //document.body.appendChild(clone);

    // let titleEl = document.createElement("div");
    // titleEl.innerText = "Title: " + review.title;
    // let scoreEl = document.createElement("div");
    // scoreEl.innerText = "Score: " + review.score;
    // let userEl = document.createElement("div");
    // userEl.innerText = "User: " + review.getUser().name;
    // let dateEl = document.createElement("div");
    // dateEl.innerText = "Date: " + Utils.timestampToDate(review.timestamp);
    // let reviewEl = document.createElement("div");

    // reviewEl.dataset.reviewId = review.getId();
    // reviewEl.onclick = Utils.toReview;
    // reviewEl.appendChild(titleEl);
    // reviewEl.appendChild(scoreEl);
    // reviewEl.appendChild(userEl);
    // reviewEl.appendChild(dateEl);
    // reviewEl.appendChild(document.createElement("br"));

    return clone;
}

async function displayLocation(location) {
    // render base properties
    nameEl.innerText = location.name;
    avgScoreEl.innerText = location.getAvgScore();
    revCountEl.innerText = location.reviewsCount;

    // render optional properties
    if (location.getDescription() != undefined) {
        Utils.enableDisplay(descriptionEl, true);
        descriptionEl.innerText = location.getDescription();
    }

    let mediaURLs = await storageManager.getLocationMediaURLs(locationId);
    if (mediaURLs != null) {
        for (let mediaURL of mediaURLs) {
            let imgEl = document.createElement("img");
            imgEl.src = mediaURL;
            imgEl.style.width = '300px';
            mediaEl.appendChild(imgEl);
        }
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

async function updateReviews() {
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
        let reviewEl = await renderReview(review);
        reviewsList.appendChild(reviewEl);
    }
}

// get id of location to display
const locationId = localStorage.getItem("locationId");

// if location to display is not defined, back to home page
if (!locationId || locationId == "undefined") {
    console.log("to home page");
    Utils.toHomePage();
}

// assign callbacks
homeButton.onclick = Utils.toHomePage;

reviewFilters.forEach((filter) => {
    filter.onchange = updateReviews;
})
reverseFilter.onchange = updateReviews;

authManager.onLogStateChange(
    (user) => {
        Utils.enableDisplay(addReviewButton, true);
        addReviewButton.onclick = function () {
            localStorage.setItem("locationId", locationId);
            Utils.redirect("./addReview.html");
        };
    },
    () => {
        Utils.enableDisplay(addReviewButton, false);
    }
);

// get location
const location = await dbManager.getLocation(locationId, true, true);

// render location
displayLocation(location);
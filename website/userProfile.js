import * as Utils from "./utils.js";
import { init, getDBManager, getAuthManager, getStorageManager } from "./init.js";

init();
const storageManager = getStorageManager();
const dbManager = getDBManager();
const authManager = getAuthManager();

const homeButton = document.getElementById("toHomeButton");
const changeNameButton = document.getElementById("changeNameButton");
const changeImageButton = document.getElementById("changeImgButton");
const deleteImageButton = document.getElementById("deleteImgButton");
const usernameLabel = document.getElementById("username");
const usernameInput = document.getElementById("usernameInput");
const userImage = document.getElementById("userImage");
const imageInput = document.getElementById("imageInput");
const reviewsList = document.getElementById("reviewsList");
const reverseFilter = document.getElementById("reverseFilter");
const reviewFilters = document.getElementsByName("reviewFilter");
let canDelete;
let userId;

async function displayUser(user) {
    // display user data
    usernameLabel.innerText = user.name;
    userImage.src = await Utils.getUserImage(userId);
    userImage.style.width = '100px';
    updateReviews();
}

async function updateImage() {
    const imgFile = this.files[0];

    // upload file and get its URL
    await storageManager.uploadUserImage(userId, imgFile);
    const imageURL = (await storageManager.getUserImageURL(userId, imgFile.name));

    // update user profile
    await authManager.updatePhoto(imageURL);

    // reload the page
    window.location.reload();
}

async function removeImage() {
    // update user profile
    await authManager.updatePhoto(null);

    // remove file from storage
    await storageManager.deleteUserImage(userId);

    // reload the page
    window.location.reload();
}

async function updateName() {
    // get new name
    const newName = usernameInput.value;

    // update user name
    authManager.updateName(newName);

    // update DB
    let user = await dbManager.getUser(userId, false);
    user.name = newName;
    await dbManager.setUser(userId, user);

    // hide text input and display label
    Utils.enableDisplay(usernameInput, false);
    Utils.enableDisplay(usernameLabel, true);
    window.location.reload();
}

function getReviewsFilter() {
    for (let filter of reviewFilters) {
        if (filter.checked) {
            return filter.value;
        }
    }
}

function renderReview(review) {

    let locationTemplate = document.getElementsByTagName("template")[0];
    let clone = locationTemplate.content.cloneNode(true);
    clone.querySelector('#title').innerText = "Title: " + review.title;
    clone.querySelector('#score').innerText = "Score: " + review.score;
    clone.querySelector('#date').innerText = Utils.timestampToDate(review.timestamp);
    clone.querySelector('#review').dataset.reviewId = review.getId();
    clone.querySelector('#review').onclick = Utils.toReview;

    if (canDelete) {
        let deleteButton = clone.querySelector('#removeButton');
        deleteButton.dataset.reviewId = review.getId();
        deleteButton.onclick = deleteReview;
    }

    return clone;
}

async function deleteReview(event) {
    event.stopPropagation();
    let reviewId = event.target.dataset.reviewId;
    await storageManager.deleteReviewMedia(reviewId);
    await dbManager.removeReview(reviewId);

    window.location.reload();
}

function updateReviews() {
    // get filter and reverse options
    const filter = getReviewsFilter();
    const reverse = reverseFilter.checked;

    let reviews = user.getReviews();
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


authManager.onLogStateChange(
    (user) => {
        // logged user is the displayed user -> allow profile editing
        if (user.uid == userId) {
            canDelete = true;
            Utils.enableDisplay(changeImageButton, true);
            Utils.enableDisplay(changeNameButton, true);
            Utils.enableDisplay(deleteImageButton, true);
            usernameInput.onchange = updateName;
            changeImageButton.onclick = (() => imageInput.click());
            imageInput.onchange = updateImage;
            deleteImageButton.onclick = removeImage;
            changeNameButton.onclick = function () {
                // hide label and display text input
                Utils.enableDisplay(usernameInput, true);
                Utils.enableDisplay(usernameLabel, false);
            }

        } else {
            Utils.enableDisplay(changeImageButton, false);
            Utils.enableDisplay(changeNameButton, false);
            Utils.enableDisplay(deleteImageButton, false);
        }

    },
    () => {
        Utils.enableDisplay(changeImageButton, false);
        Utils.enableDisplay(changeNameButton, false);
        Utils.enableDisplay(deleteImageButton, false);
    }
);

// get id of user to display
userId = localStorage.getItem("userId");

// if user to display is not defined, redirect back to home page
if (!userId || userId == "undefined") {
    Utils.toHomePage();
}

// get user
const user = await dbManager.getUser(userId, true, true);
displayUser(user);
import { init, getDBManager, getAuthManager, getStorageManager } from "./init.js";

init();
const storageManager = getStorageManager();
const dbManager = getDBManager();
const authManager = getAuthManager();

export function enableDisplay(element, enable) {
    element.hidden = enable;
}

export function toHomePage() {
    redirect("./index.html");
}

export function redirect(path) {
    window.location.replace(path);
}

export async function getUserImage(userId) {
    const imgURL = await storageManager.getUserImageURL(userId);
    if (imgURL == null) {
        return "../default-user-icon.jpg";
    }
    return imgURL;
}

export function timestampToDate(timestamp) {
    let lang = navigator.language || navigator.userLanguage;
    let date = new Date(timestamp).toLocaleDateString(lang);
    return date;
}

export function toUserProfile(event) {
    // get the element that actually fired the event (review)
    let target = event.target;
    while (target.dataset.userId == undefined) {
        target = target.parentNode;
    }

    // get user id and save it
    const userId = target.dataset.userId;
    localStorage.setItem("userId", userId);

    console.log(userId);

    // redirect to user page
    redirect("./userProfile.html");
}

export function toLocation(event) {
    // get the element that actually fired the event (location)
    let target = event.target;
    while (target.dataset.locationId == undefined) {
        target = target.parentNode;
    }

    // get location id and save it
    const locationId = target.dataset.locationId;
    localStorage.setItem("locationId", locationId);

    console.log(locationId);

    // redirect to location page
    redirect("./location.html");
}

export function toReview(event) {
    // get the element that actually fired the event (review)
    let target = event.target;
    while (target.dataset.reviewId == undefined) {
        target = target.parentNode;
    }

    // get review id and save it
    const reviewId = target.dataset.reviewId;
    localStorage.setItem("reviewId", reviewId);

    console.log(reviewId);

    // redirect to review page
    redirect("./review.html");
}
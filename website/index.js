import { init, getAuthManager, getDBManager } from "./init.js";
init();

const authManager = getAuthManager();
const dbManager = getDBManager();
const userAvatar = document.getElementById("userAvatar");
const loginButton = document.getElementById("loginButton");
const logoutButton = document.getElementById("logoutButton");
const filterButton = document.getElementById("filterButton");
const reverseFilter = document.getElementById("reverseFilter");

function login() {
    window.location.href = "authentication.html";
}

function logout() {
    authManager.logout();
    window.location.href = "index.html";
}

async function updateLocations() {
    let locations = await getAllLocations();
    // clear location list
    for (let location of locations) {
        console.log(`${location.name}, average score: ${location.getAvgScore()}, number of reviews: ${location.reviewsCount}`);
        // render location (create element and insert into the document)
    }
}

async function getAllLocations() {
    let locations = await dbManager.getAllLocations();
    const filter = getFilter();
    const reverse = reverseFilter.checked;
    console.log("getting all locations with filter " + filter + ", reverse: " + reverse);
    switch (filter) {
        case "letter": {
            dbManager.orderLocationsByName(locations, reverse);
            break;
        }
        case "score": {
            dbManager.orderLocationsByScore(locations, reverse);
            break;
        }
        case "revCount": {
            dbManager.orderLocationsByReviewsCount(locations, reverse);
            break;
        }
    }
    return locations;
}

function getFilter() {
    let filters = document.getElementsByName("filter");
    for (let filter of filters) {
        if (filter.checked) {
            return filter.value;
        }
    }
}

function hide(element) {
    element.style.display = "none";
}

function show(element) {
    element.style.display = "block";
}

userAvatar.onclick = login;
loginButton.onclick = login;
logoutButton.onclick = logout;
filterButton.onclick = updateLocations;

updateLocations();
if (authManager.getCurrentUser() != null) {
    console.log("Logged");
    hide(loginButton);
    show(logoutButton)
    show(userAvatar)
} else {
    hide(logoutButton);
    hide(userAvatar);
    show(loginButton);
    console.log("Not logged");
}



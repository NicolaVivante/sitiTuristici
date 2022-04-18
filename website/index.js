import { init, getDBManager, getAuthManager } from "./init.js";
import * as Utils from "./utils.js";

init();
const dbManager = getDBManager();
const authManager = getAuthManager();

const userAvatar = document.getElementById("userAvatar");
const loginButton = document.getElementById("loginButton");
const logoutButton = document.getElementById("logoutButton");
const filterButton = document.getElementById("filterButton");
const reverseFilter = document.getElementById("reverseFilter");
const locationsList = document.getElementById("locationsList");

function renderLocation(location) {
    // render location -> create element and insert into the document
    let nameElement = document.createElement("div");
    nameElement.innerText = "Name: " + location.name;
    let scoreElement = document.createElement("div");
    scoreElement.innerText = "Average score: " + location.getAvgScore();
    let revCountElement = document.createElement("div");
    revCountElement.innerText = "Reviews: " + location.reviewsCount;
    let locationElement = document.createElement("div");

    locationElement.id = location.getId();
    locationElement.onclick = toLocation;
    locationElement.appendChild(nameElement);
    locationElement.appendChild(scoreElement);
    locationElement.appendChild(revCountElement);
    locationElement.appendChild(document.createElement("br"));
    locationsList.appendChild(locationElement);

    // console.log(`${location.name}, average score: ${location.getAvgScore()}, number of reviews: ${location.reviewsCount}`);
}

function toLocation(event) {
    console.log(event.target);
    let target = event.target;
    while (!target.hasAttribute("id")) {
        target = target.parentNode;
    }
}

async function updateLocations() {
    // get filter and reverse options
    const filter = getLocationFilter();
    const reverse = reverseFilter.checked;

    // get the locations
    let locations = await dbManager.getAllLocations();

    // filter the locations
    switch (filter) {
        case "letter":
            dbManager.orderLocationsByName(locations, reverse);
            break;
        case "score":
            dbManager.orderLocationsByScore(locations, reverse);
            break;
        case "revCount":
            dbManager.orderLocationsByReviewsCount(locations, reverse);
            break;
        default:
            dbManager.orderLocationsByName(locations, false);
            console.log('no valid filter, sorting by alphabetical order')
    }

    // clear location list
    locationsList.innerHTML = '';

    // display the locations
    for (let location of locations) {
        renderLocation(location);
    }
}

function getLocationFilter() {
    let filters = document.getElementsByName("locationFilter");
    for (let filter of filters) {
        if (filter.checked) {
            return filter.value;
        }
    }
}

userAvatar.onclick = function () {
    localStorage.setItem("userId", userAvatar.dataset.userId);
    Utils.redirect("./userProfile.html");
};

loginButton.onclick = function () {
    Utils.redirect("./authentication.html");
};

logoutButton.onclick = async function () {
    await authManager.logout();
    Utils.toHomePage();
};

filterButton.onclick = updateLocations;


updateLocations();

authManager.onLogStateChange(
    // when logged
    (user) => {
        //console.log(`Name: ${user.displayName}, email: ${user.email}`);
        //console.log(user);
        Utils.enableDisplay(loginButton, false);
        Utils.enableDisplay(logoutButton, true);
        userAvatar.dataset.userId = user.uid;
        if (user.photoURL != null) {
            userAvatar.src = user.photoURL;
        } else {
            userAvatar.src = "../default-user-icon.jpg";
        }
    },
    // when not logged
    () => {
        Utils.enableDisplay(loginButton, true);
        Utils.enableDisplay(logoutButton, false);
        Utils.enableDisplay(userAvatar, false);
        userAvatar.src = "../default-user-icon.jpg";
    });



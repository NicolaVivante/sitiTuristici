import { init, getDBManager, getAuthManager } from "./init.js";
import * as Utils from "./utils.js";

init();
const dbManager = getDBManager();
const authManager = getAuthManager();

const userAvatar = document.getElementById("userAvatar");
const loginButton = document.getElementById("loginButton");
const logoutButton = document.getElementById("logoutButton");
const reverseFilter = document.getElementById("reverseFilter");
const locationsList = document.getElementById("locationsList");
const locationFilters = document.getElementsByName("locationFilter");

function renderLocation(location) {
    // render location -> create element and insert into the document
    let nameEl = document.createElement("div");
    nameEl.innerText = "Name: " + location.name;
    let scoreEl = document.createElement("div");
    scoreEl.innerText = "Average score: " + location.getAvgScore();
    let revCountEl = document.createElement("div");
    revCountEl.innerText = "Reviews: " + location.reviewsCount;
    let locationEl = document.createElement("div");

    locationEl.id = location.getId();
    locationEl.onclick = toLocation;
    locationEl.appendChild(nameEl);
    locationEl.appendChild(scoreEl);
    locationEl.appendChild(revCountEl);
    locationEl.appendChild(document.createElement("br"));

    return locationEl;

    // console.log(`${location.name}, average score: ${location.getAvgScore()}, number of reviews: ${location.reviewsCount}`);
}

function toLocation(event) {
    // get the element that actually fired the event (location)
    let target = event.target;
    while (target.id == "") {
        target = target.parentNode;
    }

    // get location id and save it
    const locationId = target.id;
    localStorage.setItem("locationId", locationId);

    console.log(locationId);

    // redirect to location page
    Utils.redirect("./location.html");
}

async function updateLocations() {
    // get filter and reverse options
    const filter = getLocationFilter();
    const reverse = reverseFilter.checked;

    // get the locations
    let locations = await dbManager.getAllLocations();

    // order the locations
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
            console.log('no valid filter, sorting by alphabetical order');
    }

    // clear location list
    locationsList.innerHTML = '';

    // display the locations
    for (let location of locations) {
        let locationEl = renderLocation(location);
        locationsList.appendChild(locationEl);
    }
}

function getLocationFilter() {
    for (let filter of locationFilters) {
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

locationFilters.forEach((filter) => {
    filter.onchange = updateLocations;
})
reverseFilter.onchange = updateLocations;


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



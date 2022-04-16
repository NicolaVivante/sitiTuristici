import * as Utils from "./utils.js";

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
    locationElement.appendChild(nameElement);
    locationElement.appendChild(scoreElement);
    locationElement.appendChild(revCountElement);
    locationElement.appendChild(document.createElement("br"));
    locationsList.appendChild(locationElement);

    // console.log(`${location.name}, average score: ${location.getAvgScore()}, number of reviews: ${location.reviewsCount}`);
}

async function updateLocations() {
    const filter = getLocationFilter();
    const reverse = reverseFilter.checked;
    // console.log("getting all locations with filter " + filter + ", reverse: " + reverse);
    let locations = await Utils.getAllLocations(filter, reverse);
    // clear location list
    locationsList.innerHTML = '';
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
    window.location.replace("./userProfile.html");
};

loginButton.onclick = function () {
    window.location.replace("./authentication.html");
};

logoutButton.onclick = function () {
    Utils.logout();
    window.location.replace("./index.html");
};

filterButton.onclick = updateLocations;

updateLocations();

Utils.onLogStateChange(
    // when logged
    (user) => {
        console.log(`Name: ${user.displayName}, email: ${user.email}`);
        Utils.enableDisplay(loginButton, false);
        Utils.enableDisplay(logoutButton, true);
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



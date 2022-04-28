import { init, getDBManager, getAuthManager, getStorageManager } from "./init.js";
import * as Utils from "./utils.js";

init();
const dbManager = getDBManager();
const authManager = getAuthManager();
const storageManager = getStorageManager();

const userAvatar = document.getElementById("userAvatar");
const loginButton = document.getElementById("loginButton");
const logoutButton = document.getElementById("logoutButton");
const reverseFilter = document.getElementById("reverseFilter");
const locationsList = document.getElementById("locationsList");
const locationFilters = document.getElementsByName("locationFilter");

async function renderLocation(location) {

    let locationTemplate = document.getElementsByTagName("template")[0];
    let clone = locationTemplate.content.cloneNode(true);
    clone.querySelector('#name').innerText = "Name: " + location.name;
    clone.querySelector('#avgScore').innerText = "Average Score: " + location.getAvgScore();
    clone.querySelector('#reviewsCount').innerText = "Reviews Count: " + location.reviewsCount;
    clone.querySelector('#location').dataset.locationId = location.getId();
    clone.querySelector('#location').onclick = Utils.toLocation;

    let imgURLs = await storageManager.getLocationMediaURLs(location.getId());
    if (imgURLs != null) {
        clone.querySelector('#locationImage').src = imgURLs[0];
    }

    return clone;
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
        let locationEl = await renderLocation(location);
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
    async function (authUser) {
        let user = await dbManager.getUser(authUser.uid, false, false);
        //console.log(`Name: ${user.displayName}, email: ${user.email}`);
        console.log(user);
        Utils.enableDisplay(loginButton, false);
        Utils.enableDisplay(logoutButton, true);
        userAvatar.dataset.userId = authUser.uid;
        userAvatar.src = await Utils.getUserImage(authUser.uid);
        userAvatar.style.width = "100px";
        userAvatar.title = user.name;
    },
    // when not logged
    () => {
        Utils.enableDisplay(loginButton, true);
        Utils.enableDisplay(logoutButton, false);
        userAvatar.src = "../default-user-icon.jpg";
        Utils.enableDisplay(userAvatar, false);
    });
import * as Utils from "./utils.js";
import { init, getDBManager, getAuthManager, getStorageManager } from "./init.js";
import { Location } from "../Location.js";

init();
const storageManager = getStorageManager();
const dbManager = getDBManager();
const authManager = getAuthManager();

const homeButton = document.getElementById("toHomeButton");
const locationNameEl = document.getElementById("locationName");
const locationPositionEl = document.getElementById("locationPosition");
const locationDescriptionEl = document.getElementById("locationDescription");
const locationMediaEl = document.getElementById("locationMedia");
const locationForm = document.getElementById("locationForm");
let userId;


locationForm.onsubmit = async function (event) {
    event.preventDefault();

    const name = locationNameEl.value;
    const position = locationPositionEl.value;
    const description = locationDescriptionEl.value;
    let location = new Location(name, position);
    if (description != "") {
        location.addDescription(description);
    }

    const locationId = await dbManager.addLocation(location);

    if (locationMediaEl.files.length > 0) {
        for (let file of locationMediaEl.files) {
            // upload file and get its URL
            await storageManager.uploadLocationMedia(locationId, file);
            const mediaURL = (await storageManager.getLocationMediaURL(locationId, file.name));
            location.addMedia(mediaURL);
        }
    }
    await dbManager.setLocation(locationId, location);
    Utils.toHomePage();
}

// assign callbacks
homeButton.onclick = Utils.toHomePage;

authManager.onLogStateChange(
    async function (loggedUser) {
        userId = loggedUser.uid;

        let user = await dbManager.getUser(userId, false, false);
        if (user.isAdmin()) {
            console.log("Admin!");
        } else {
            console.log("Not admin!");
            Utils.toHomePage();
        }
    },
    () => {
        Utils.toHomePage();
    }
);
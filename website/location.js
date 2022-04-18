import * as Utils from "./utils.js";
import { init, getDBManager } from "./init.js";

init();
const dbManager = getDBManager();








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
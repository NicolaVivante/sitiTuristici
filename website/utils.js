import { init, getDBManager, getAuthManager, getStorageManager } from "./init.js";
import { User } from "../User.js";

init();
const dbManager = getDBManager();
const storageManager = getStorageManager();
const authManager = getAuthManager();

export function currentUser() {
    //TODO: maybe change
    return authManager.getCurrentUser();
}

export function onLogStateChange(loggedCallback, notLoggedCallback) {
    authManager.onLogStateChange(loggedCallback, notLoggedCallback);
}

export async function login(email, password) {
    return await authManager.login(email, password);
}

export async function logout() {
    await authManager.logout();
}

export async function register(name, email, password) {
    let error = await authManager.register(name, email, password);
    if (error == null) {
        let newUser = new User(name, email);
        await dbManager.setUser(currentUser().uid, newUser);
    };
    return error;
}

export async function updateUserPhoto(imageFile) {
    const userId = authManager.getCurrentUser().uid;

    await storageManager.uploadUserImage(userId, imageFile);
    const imageURL = await storageManager.getUserImageURL(userId, imageFile.name);

    authManager.updatePhoto(imageURL);

    let user = await dbManager.getUser(userId, false);
    user.setImage(imageURL);
    dbManager.setUser(userId, user);
}

export async function updateUsername(newName) {
    authManager.updateName(newName);

    const userId = authManager.getCurrentUser().uid;
    let user = await dbManager.getUser(userId, false);
    user.name = newName;
    dbManager.setUser(userId, user);
}

export async function getAllLocations(filter, reverse) {
    const LETTER = "letter";
    const SCORE = "score";
    const REV_COUNT = "revCount";

    let locations = await dbManager.getAllLocations();
    switch (filter) {
        case LETTER:
            dbManager.orderLocationsByName(locations, reverse);
            break;
        case SCORE:
            dbManager.orderLocationsByScore(locations, reverse);
            break;
        case REV_COUNT:
            dbManager.orderLocationsByReviewsCount(locations, reverse);
            break;
        default:
            dbManager.orderLocationsByName(locations, false);
            console.log('no valid filter, sorting by alphabetical order')
    }
    return locations;
}

export function enableDisplay(element, enable) {
    element.style.display = enable ? "inline-block" : "none";
}
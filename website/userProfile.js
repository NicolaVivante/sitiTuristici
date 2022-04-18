import * as Utils from "./utils.js";
import { init, getDBManager, getAuthManager, getStorageManager } from "./init.js";

init();
const storageManager = getStorageManager();
const dbManager = getDBManager();
const authManager = getAuthManager();

const homeButton = document.getElementById("toHomeButton");
const changeNameButton = document.getElementById("changeNameButton");
const changeImageButton = document.getElementById("changeImgButton");
const usernameLabel = document.getElementById("username");
const usernameInput = document.getElementById("usernameInput");
const userImage = document.getElementById("userImage");
const imageInput = document.getElementById("imageInput");

authManager.onLogStateChange(
    (loggedUser) => {
        if (loggedUser.uid == userId) {

        }
    },
    () => {
        console.log("Not logged ");
    }
);

function displayUser(user) {
    console.log(user);
    // display user data
    usernameLabel.innerText = user.name;
    if ('image' in user) {
        userImage.src = user.image;
    } else {
        userImage.src = "../default-user-icon.jpg";
    }
}

async function updateImage() {
    const imgFile = this.files[0];

    // upload file and get its URL
    await storageManager.uploadUserImage(userId, imgFile);
    const imageURL = await storageManager.getUserImageURL(userId, imgFile.name);

    // update user profile
    authManager.updatePhoto(imageURL);

    // update DB
    let user = await dbManager.getUser(userId, false);
    user.setImage(imageURL);
    await dbManager.setUser(userId, user);

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

// assign callbacks
homeButton.onclick = Utils.toHomePage;
usernameInput.onchange = updateName;
changeImageButton.onclick = (() => imageInput.click());
imageInput.onchange = updateImage;
changeNameButton.onclick = function () {
    // hide label and display text input
    Utils.enableDisplay(usernameInput, true);
    Utils.enableDisplay(usernameLabel, false);
}

// get id of user to display
const userId = localStorage.getItem("userId");

// if user to display is not defined, redirect back to home page
if (userId == null) {
    Utils.toHomePage();
}

// get user
const user = await dbManager.getUser(userId, true);
displayUser(user);
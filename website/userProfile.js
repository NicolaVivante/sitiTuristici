import * as Utils from "./utils.js";

const toHomeButton = document.getElementById("toHomePageButton");
const changeNameButton = document.getElementById("changeNameButton");
const changeImageButton = document.getElementById("changeImgButton");
const usernameLabel = document.getElementById("username");
const usernameInput = document.getElementById("usernameInput");
const userMail = document.getElementById("userMail");
const userImage = document.getElementById("userImage");
const imageInput = document.getElementById("imageInput");

changeNameButton.onclick = function () {
    console.log("username clicked");
    Utils.enableDisplay(usernameInput, true);
    Utils.enableDisplay(usernameLabel, false);
}

usernameInput.onchange = async function () {
    await Utils.updateUsername(usernameInput.value);
    Utils.enableDisplay(usernameInput, false);
    Utils.enableDisplay(usernameLabel, true);
    window.location.reload();
}

toHomeButton.onclick = function () {
    window.location.replace("./index.html");
}

changeImageButton.onclick = function () {
    imageInput.click();
}

imageInput.onchange = async function () {
    const imgFile = this.files[0];
    //reader.readAsDataURL(imgFile);
    //console.log(imgFile);
    await Utils.updateUserImage(imgFile);
    window.location.reload();
}

Utils.onLogStateChange(
    (user) => {
        usernameLabel.innerText = user.displayName;
        userMail.innerText = user.email;
        if (user.photoURL == null) {
            userImage.src = "../default-user-icon.jpg";
        } else {
            userImage.src = user.photoURL;
        }
    },
    () => {
        console.log("Not logged ");
        //TODO: redirect to home page
    }
);
import * as Utils from "./utils.js";

const toHomeButton = document.getElementById("toHomePageButton");
const userName = document.getElementById("userName");
const userMail = document.getElementById("userMail");
const userImage = document.getElementById("userImage");


toHomeButton.onclick = function () {
    window.location.replace("./index.html");
}

userImage.onclick = function () {
    //TODO: fix
    let target = document.getElementById("target");
    let src = document.getElementById("src");
    let fr = new FileReader();
    fr.onload = function () {
        target.src = fr.result;
        console.log(fr.result);
    }
    console.log(fr.readAsDataURL(src.files[0]));
}

Utils.onLogStateChange(
    (user) => {
        console.log("logged");
        userName.innerText = user.displayName;
        userMail.innerText = user.email;
        if (user.photoURL == null) {
            userImage.src = "../default-user-icon.jpg";
        } else {
            userImage.src = user.photoURL;
        }
    },
    () => {

    }
);
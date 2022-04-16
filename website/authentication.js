import * as Utils from "./utils.js";

const toHomeButton = document.getElementById("toHomePageButton");
const logOptions = document.getElementById("logOptions");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

logOptions.onchange = updateLogOptions;

loginForm.onsubmit = async function (event) {
    event.preventDefault(); // prevent page reload

    const email = document.getElementById("loginMail").value;
    const password = document.getElementById("loginPassword").value;
    const error = await Utils.login(email, password);
    if (error == null) {
        window.location.replace("./index.html");
    } else {
        console.log("Error: " + error);
        // TODO: manage error
    }
}

toHomeButton.onclick = function () {
    window.location.replace("./index.html");
}

registerForm.onsubmit = async function (event) {
    event.preventDefault(); // prevent page reload

    const name = document.getElementById("registerName").value;
    const email = document.getElementById("registerMail").value;
    const password = document.getElementById("registerPassword").value;
    const error = await Utils.register(name, email, password);
    if (error == null) {
        console.log("User created");
        window.location.replace("./index.html");
    } else {
        console.log("Error: " + error);
        // TODO: manage error
    }
}

function updateLogOptions() {
    const logOptions = document.getElementsByName("logOption");
    for (const filter of logOptions) {
        if (filter.checked) {
            switch (filter.value) {
                case "login": {
                    Utils.enableDisplay(loginForm, true);
                    Utils.enableDisplay(registerForm, false);
                    break;
                }
                case "register": {
                    Utils.enableDisplay(loginForm, false);
                    Utils.enableDisplay(registerForm, true);
                    break;
                }
            }
        }
    }
}


updateLogOptions();
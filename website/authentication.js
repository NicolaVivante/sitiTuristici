import * as Utils from "./utils.js";

const logOptions = document.getElementById("logOptions");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

logOptions.onchange = updateLogOptions;

loginForm.onsubmit = async function (event) {
    event.preventDefault();

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

function updateLogOptions() {
    // get log option

    const logOptions = document.getElementsByName("logOption");
    let login;
    for (const filter of logOptions) {
        if (filter.checked) {
            switch (filter.value) {
                case "login": {
                    console.log("Login selected");
                    login = true;
                    break;
                }
                case "register": {
                    console.log("Register selected");
                    login = false;
                    break;
                }
            }
        }
    }

    displayLogOptions(login);
}

function displayLogOptions(login) {
    Utils.enableDisplay(loginForm, login);
    Utils.enableDisplay(registerForm, !login);
}

updateLogOptions();
import { init, getDBManager, getAuthManager } from "./init.js";
import * as Utils from "./utils.js";
import { User } from "../User.js";

init();

const dbManager = getDBManager();
const authManager = getAuthManager();

const homeButton = document.getElementById("toHomeButton");
const logOptions = document.getElementById("logOptions");

const loginForm = document.getElementById("loginForm");
const loginMail = document.getElementById("loginMail");
const loginPassword = document.getElementById("loginPassword");

const registerForm = document.getElementById("registerForm");
const registerName = document.getElementById("registerName");
const registerMail = document.getElementById("registerMail");
const registerPassword = document.getElementById("registerPassword");

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

async function login(event) {
    event.preventDefault(); // prevent page reload

    // get user data
    const email = loginMail.value;
    const password = loginPassword.value;

    // try login
    const error = await authManager.login(email, password);
    if (error == null) {
        Utils.toHomePage();
    } else {
        console.log("Error: " + error);
        // TODO: manage error
    }
}

async function register(event) {
    event.preventDefault(); // prevent page reload

    // get user data
    const name = registerName.value;
    const email = registerMail.value;
    const password = registerPassword.value;

    // try to register the user
    const error = await authManager.register(name, email, password);

    if (error == null) {
        // create user in DB
        let newUser = new User(name, email);
        await dbManager.setUser(authManager.getCurrentUser().uid, newUser);

        console.log("User created");

        // redirect to home page
        Utils.toHomePage();
    } else {
        console.log("Error: " + error);
        // TODO: manage error
    }
}

// assign callbacks
homeButton.onclick = Utils.toHomePage;
logOptions.onchange = updateLogOptions;
loginForm.onsubmit = login;
registerForm.onsubmit = register;

// display login form as active on page load
updateLogOptions();
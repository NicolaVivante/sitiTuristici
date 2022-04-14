import { init, getAuthManager } from "./init.js";
init();

const authManager = getAuthManager();
const userAvatar = document.getElementById("userAvatar");
const loginButton = document.getElementById("loginButton");
const logoutButton = document.getElementById("logoutButton");

function hide(element) {
    element.style.display = "none";
}

function show(element) {
    element.style.display = "block";
}

userAvatar.onclick = login;
loginButton.onclick = login;
logoutButton.onclick = logout;

if (authManager.getCurrentUser() != null) {
    console.log("Logged");
    hide(loginButton);
    show(logoutButton)
    show(userAvatar)
} else {
    hide(logoutButton);
    hide(userAvatar);
    show(loginButton);
    console.log("Not logged");
}

export function login() {
    window.location.href = "authentication.html";
}

export function logout() {
    authManager.logout();
    window.location.href = "index.html";
}


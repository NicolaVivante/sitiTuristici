import { init } from "./init.js";
init();

document.getElementById("userButton").onclick = authentication;

export function authentication() {
    if (self.authManager != null && self.authManager.getCurrentUser() != null) {
        console.log("to user page");
        window.location.href = "userProfile.html";
    } else {
        console.log("to login / register page");
        window.location.href = "authentication.html";
    }
}


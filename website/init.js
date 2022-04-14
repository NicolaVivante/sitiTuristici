import { RealtimeDBManager } from "../realtimeDBManager.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.9/firebase-app.js";
import { AuthenticationManager } from "../authenticationManager.js";

const firebaseConfig = {
    apiKey: "AIzaSyDm5EynX5GYeJXF7VWZBO3IY0vjjRPl_hA",
    authDomain: "sitituristicitest.firebaseapp.com",
    databaseURL: "https://sitituristicitest-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "sitituristicitest",
    storageBucket: "sitituristicitest.appspot.com",
    messagingSenderId: "1028951298732",
    appId: "1:1028951298732:web:4ffebc2c94d2ff9d59c509"
};

export function init() {

    let init = localStorage.getItem("init");
    if (init != true) {
        const app = initializeApp(firebaseConfig);
        let dbManager = new RealtimeDBManager(app);
        let authManager = new AuthenticationManager(dbManager);
        localStorage.setItem("dbManager", dbManager);
        localStorage.setItem("authManager", authManager);
        localStorage.setItem("init", true);
    }
}
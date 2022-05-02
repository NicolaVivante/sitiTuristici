import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.9/firebase-app.js";
import { RealtimeDBManager } from "../RealtimeDBManager.js";
import { AuthenticationManager } from "../AuthenticationManager.js";
import { StorageManager } from "../StorageManager.js";
import { FirestoreDBManager } from "../FirestoreDBManager.js";

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
        localStorage.setItem("config", firebaseConfig);
        localStorage.setItem("init", true);
    }
}

export function getAuthManager() {
    const app = initializeApp(firebaseConfig);
    let dbManager = getDBManager();
    return new AuthenticationManager(dbManager);
}

export function getDBManager() {
    const app = initializeApp(firebaseConfig);
    // return new RealtimeDBManager(app);
    return new FirestoreDBManager(app);
}

export function getStorageManager() {
    const app = initializeApp(firebaseConfig);
    return new StorageManager(app);
}

// temp
export function getFirebaseDBManager() {
    const app = initializeApp(firebaseConfig);
    return new FirestoreDBManager(app);
}
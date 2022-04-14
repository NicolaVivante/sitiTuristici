import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signOut } from "https://www.gstatic.com/firebasejs/9.6.9/firebase-auth.js";
import { User } from "./user.js";

export class AuthenticationManager {
    dbManager;
    auth;

    constructor(dbManager) {
        this.dbManager = dbManager;
        this.auth = getAuth();
    }

    getCurrentUser() {
        return this.auth.currentUser;
    }

    async register(name, email, password) {
        await createUserWithEmailAndPassword(this.auth, email, password)
            .then((userCredential) => {
                // add user to db
                let newUser = new User(name, email);
                this.dbManager.addUser(newUser, userCredential.user.uid);
            })
            .then(() => {
                this.updateName(name);
                console.log("User created");
            })
            .catch((error) => {
                const errorMessage = error.message;
                console.log(errorMessage);
            });
    }

    async login(email, password) {
        await signInWithEmailAndPassword(this.auth, email, password)
            .catch((error) => {
                const errorMessage = error.message;
                console.log(errorMessage);
            });
    }

    async logout() {
        await signOut(this.auth)
            .catch((error) => {
                const errorMessage = error.message;
                console.log(errorMessage);
            });
    }

    async updateName(name) {
        await updateProfile(this.auth.currentUser, { displayName: name })
            .catch((error) => {
                const errorMessage = error.message;
                console.log(errorMessage);
            });
    }

    async updatePhoto(photoURL) {
        await updateProfile(this.auth.currentUser, { photoURL: photoURL })
            .catch((error) => {
                const errorMessage = error.message;
                console.log(errorMessage);
            });
    }
}
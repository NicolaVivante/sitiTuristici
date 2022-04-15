import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signOut } from "https://www.gstatic.com/firebasejs/9.6.9/firebase-auth.js";
import { User } from "./User.js";

export class AuthenticationManager {
    auth;

    constructor(app) {
        const firebaseApp = app;
        this.auth = getAuth();
    }

    getCurrentUser() {
        return this.auth.currentUser;
    }

    async register(name, email, password) {
        await createUserWithEmailAndPassword(this.auth, email, password)
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

    async updatePhoto(imageURL) {
        await updateProfile(this.auth.currentUser, { photoURL: imageURL })
            .catch((error) => {
                const errorMessage = error.message;
                console.log(errorMessage);
            });
    }
}
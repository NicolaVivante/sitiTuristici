import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.9/firebase-auth.js";

export class AuthenticationManager {
    auth;

    constructor(app) {
        const firebaseApp = app;
        this.auth = getAuth();
    }

    getCurrentUser() {
        return this.auth.currentUser;
    }

    async onLogStateChange(callback1, callback2) {
        onAuthStateChanged(this.auth, (user) => {
            if (user) {
                callback1(user);
            } else {
                callback2();
            }
        });
    }

    async register(name, email, password) {
        return await createUserWithEmailAndPassword(this.auth, email, password)
            .then(() => {
                this.updateName(name);
                return null;
            })
            .catch((error) => {
                const errorMessage = error.message;
                console.log(errorMessage);
                return error.code;
            });
    }

    async login(email, password) {
        return await signInWithEmailAndPassword(this.auth, email, password)
            .then(() => {
                return null;
            })
            .catch((error) => {
                const errorMessage = error.message;
                console.log(errorMessage);
                return error.code;
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

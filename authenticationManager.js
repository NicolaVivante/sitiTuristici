import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signOut } from "https://www.gstatic.com/firebasejs/9.6.9/firebase-auth.js";
import { User } from "./User.js";
import { StorageManager } from "../StorageManager.js";

export class AuthenticationManager {
    dbManager;
    storageManager;
    auth;

    constructor(dbManager, app) {
        this.dbManager = dbManager;
        this.storageManager = new StorageManager(app);
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
                this.dbManager.setUser(userCredential.user.uid, newUser);
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
        // update auth profile
        await updateProfile(this.auth.currentUser, { displayName: name })
            .catch((error) => {
                const errorMessage = error.message;
                console.log(errorMessage);
            });

        // update db
        const userId = this.auth.currentUser.uid;
        let user = this.dbManager.getUser(userId, false);
        user.name = name;
        this.dbManager.setUser(userId, user);
    }

    async updatePhoto(photoFile) {
        const userId = this.auth.currentUser.uid;

        // update storage
        await this.storageManager.uploadUserImage(userId, photoFile);

        // get photo URL
        let imageURL = await this.storageManager.getUserImageURL(userId, photoFile.name);

        // update auth profile
        await updateProfile(this.auth.currentUser, { photoURL: imageURL })
            .catch((error) => {
                const errorMessage = error.message;
                console.log(errorMessage);
            });

        // update db
        let user = this.dbManager.getUser(userId, false);
        user.setPhoto(imageURL);
        this.dbManager.setUser(userId, user);
    }
}
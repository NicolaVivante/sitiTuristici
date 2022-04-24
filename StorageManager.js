import { getStorage, ref, uploadBytes, getDownloadURL, listAll, deleteObject } from "https://www.gstatic.com/firebasejs/9.6.9/firebase-storage.js";

export class StorageManager {

    storage;
    LOCATIONS_MEDIA_PATH = 'locationsMedia';
    REVIEWS_MEDIA_PATH = 'reviewsMedia';
    USERS_MEDIA_PATH = 'usersMedia';

    constructor(app) {
        this.storage = getStorage(app);
    }

    async removeAllChilds(ref) {
        const oldMedia = (await listAll(ref)).items;
        for (let oldFile of oldMedia) {
            deleteObject(oldFile);
        }
    }

    async uploadUserImage(userId, imageFile) {
        const storageRef = ref(this.storage, this.USERS_MEDIA_PATH);
        const userRef = ref(storageRef, "/" + userId);

        await this.removeAllChilds(userRef);
        const imageRef = ref(userRef, "/" + imageFile.name);

        await uploadBytes(imageRef, imageFile).then((snapshot) => {
            console.log('User image uploaded');
        }).catch((error) => {
            const errorCode = error.errorCode;
            const errorMessage = error.message;
            console.log(errorMessage + ", " + errorCode);
        });
    }

    async getUserImageURL(userId) {
        const storageRef = ref(this.storage, this.USERS_MEDIA_PATH + "/" + userId);
        const media = (await listAll(storageRef));
        if (media.items.length == 0) {
            console.log("No media for this user");
            return null;
        }
        return await getDownloadURL(media.items[0]);
    }

    async deleteUserImage(userId) {
        const storageRef = ref(this.storage, this.USERS_MEDIA_PATH + "/" + userId);
        await this.removeAllChilds(storageRef);
    }

    async uploadReviewMedia(reviewId, file) {
        const storageRef = ref(this.storage, this.REVIEWS_MEDIA_PATH);
        const reviewRef = ref(storageRef, "/" + reviewId);

        await this.removeAllChilds(reviewRef);
        const fileRef = ref(reviewRef, "/" + file.name);

        await uploadBytes(fileRef, file).then((snapshot) => {
            console.log('Review file uploaded');
        }).catch((error) => {
            const errorCode = error.errorCode;
            const errorMessage = error.message;
            console.log(errorMessage + ", " + errorCode);
        });
    }

    async getReviewMediaURLs(reviewId) {
        const storageRef = ref(this.storage, this.REVIEWS_MEDIA_PATH + "/" + reviewId);
        const media = (await listAll(storageRef));
        if (media.items.length == 0) {
            console.log("No media for this review");
            return null;
        }
        let mediaURLs = [];
        for (let mediaRef of media.items) {
            mediaURLs.push(await getDownloadURL(mediaRef));
        }
        return mediaURLs;
    }

    async deleteReviewMedia(reviewId) {
        const storageRef = ref(this.storage, this.REVIEWS_MEDIA_PATH + "/" + reviewId);
        await this.removeAllChilds(storageRef);
    }

    async uploadLocationMedia(locationId, file) {
        const storageRef = ref(this.storage, this.LOCATIONS_MEDIA_PATH);
        const locationRef = ref(storageRef, "/" + locationId);

        await this.removeAllChilds(locationRef);
        const fileRef = ref(locationRef, "/" + file.name);

        await uploadBytes(fileRef, file).then((snapshot) => {
            console.log('Location file uploaded');
        }).catch((error) => {
            const errorCode = error.errorCode;
            const errorMessage = error.message;
            console.log(errorMessage + ", " + errorCode);
        });
    }

    async getLocationMediaURLs(locationId) {
        const storageRef = ref(this.storage, this.LOCATIONS_MEDIA_PATH + "/" + locationId);
        const media = (await listAll(storageRef));
        if (media.items.length == 0) {
            console.log("No media for this location");
            return null;
        }
        let mediaURLs = [];
        for (let mediaRef of media.items) {
            mediaURLs.push(await getDownloadURL(mediaRef));
        }
        return mediaURLs;
    }

    async deleteLocationMedia(locationId) {
        const storageRef = ref(this.storage, this.LOCATIONS_MEDIA_PATH + "/" + locationId);
        await this.removeAllChilds(storageRef);
    }

    // for Ferro 
    async downloadFile() {

        // get file reference
        let storageRef = ref(this.storage, "usersMedia/Qqn7huBj1EczSfJ7NeBSP5QwgMg2"); // TODO: change this.storage and path
        let fileRef = (await listAll(storageRef)).items[0];

        // get download url and name of the file
        let fileUrl = await getDownloadURL(fileRef);
        let fileName = fileRef.name;

        // download the file
        fetch(fileUrl, { mode: 'no-cors' }) // bypass cors problem from before :)
            .then(response => response.blob())
            .then(blob => {
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = fileName; // set file name
                link.click();
            })
            .catch(console.error);
    }
}
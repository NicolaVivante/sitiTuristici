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

    async getUserImageURL(userId, imageName) {
        const storageRef = ref(this.storage, this.USERS_MEDIA_PATH + "/" + userId + "/" + imageName);
        return await getDownloadURL(storageRef);
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

    async getReviewMediaURL(reviewId, fileName) {
        const storageRef = ref(this.storage, this.REVIEWS_MEDIA_PATH + "/" + reviewId + "/" + fileName);
        return await getDownloadURL(storageRef);
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

    async getLocationMediaURL(locationId, fileName) {
        const storageRef = ref(this.storage, this.LOCATIONS_MEDIA_PATH + "/" + locationId + "/" + fileName);
        return await getDownloadURL(storageRef);
    }

    async deleteLocationMedia(locationId) {
        const storageRef = ref(this.storage, this.LOCATIONS_MEDIA_PATH + "/" + locationId);
        await this.removeAllChilds(storageRef);
    }
}
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
        for (let oldFile of oldFile) {
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

}
import { getFirestore, collection, addDoc, query, getDocs, where } from "https://www.gstatic.com/firebasejs/9.6.9/firebase-firestore.js";
import { DBManager } from "./DBManager.js";
import { Location } from "./Location.js";

export class FirestoreDBManager extends DBManager {

    firestore;
    LOCATIONS_PATH = 'locations';
    REVIEWS_PATH = 'reviews';
    USERS_PATH = 'users';

    constructor(app) {
        super(app);
        this.firestore = getFirestore(app);
    }

    // override

    // call given callback each time db changes
    onDBChange(callBack) { }

    // add given location to locations list and return the location id
    async addLocation(location) {
        const collectionRef = collection(this.firestore, this.LOCATIONS_PATH);
        location.clean();
        Object.setPrototypeOf(location, Object.prototype);
        return (await addDoc(collectionRef, location)).path;
    }

    // remove location at given id
    removeLocation(locationId) { }

    // set location at given id
    async setLocation(locationId, location) { }

    // get location with given id, with reviews if specified
    async getLocation(locationId, withReviews, withUsers) { }

    // get all locations
    async getAllLocations() {
        const collectionRef = collection(this.firestore, this.LOCATIONS_PATH);
        const snap = await getDocs(query(collectionRef));

        let locations = [];

        snap.forEach(
            (doc) => {
                console.log(doc.id);
                let location = doc.data();
                Object.setPrototypeOf(location, Location.prototype);
                console.log(location);
                locations.push(location);
            }
        );

        return locations;
    }

    // get all reviews
    async getAllReviews() { }

    // get all reviews of location with given id with the user who created the review if specified
    async getReviewsOfLocation(locationId, withUsers) { }

    // get all reviews of user with given id with the reviewed location if specified
    async getReviewsOfUser(userId, withLocations) { }

    // add given review to review list and return the review id
    async addReview(review) { }

    // remove review at given id
    async removeReview(reviewId) { }

    // set given user
    async setUser(userId, user) { }

    // get all users
    async getAllUsers() { }

    // get user at given id, with his reviews and with the reviewed locations if specified
    async getUser(userId, withReviews, withLocations) { }

    // get review at given id, with user and reviewed location if specified
    async getReview(reviewId, withUser, withLocation) { }
}
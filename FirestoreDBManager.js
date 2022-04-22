import { getFirestore, collection, doc, addDoc, setDoc, getDoc, deleteDoc, query, getDocs, where } from "https://www.gstatic.com/firebasejs/9.6.9/firebase-firestore.js";
import { DBManager } from "./DBManager.js";
import { Location } from "./Location.js";
import { Review } from "./Review.js";

export class FirestoreDBManager extends DBManager {

    firestore;
    LOCATIONS_PATH = 'locations';
    REVIEWS_PATH = 'reviews';
    USERS_PATH = 'users';

    constructor(app) {
        super(app);
        this.firestore = getFirestore(app);
    }

    // call given callback each time db changes
    onDBChange(callBack) { }

    // add given location to locations list and return the location id
    async addLocation(location) {
        const collectionRef = collection(this.firestore, this.LOCATIONS_PATH);
        location.clean();
        Object.setPrototypeOf(location, Object.prototype);
        const ref = (await addDoc(collectionRef, location));
        console.log(ref);
        //TODO: fix path return
        const path = ref.path;
        Object.setPrototypeOf(location, Location.prototype);
        return path;
    }

    // remove location at given id
    async removeLocation(locationId) {
        const docRef = doc(this.firestore, this.LOCATIONS_PATH + "/" + locationId);
        await deleteDoc(docRef);
    }

    // set location at given id
    async setLocation(locationId, location) {
        const docRef = doc(this.firestore, this.LOCATIONS_PATH + "/" + locationId);
        location.clean();
        Object.setPrototypeOf(location, Object.prototype);
        await setDoc(docRef, location);
        Object.setPrototypeOf(location, Location.prototype);
    }

    // get location with given id, with reviews if specified
    async getLocation(locationId, withReviews, withUsers) {
        const docRef = doc(this.firestore, this.LOCATIONS_PATH + "/" + locationId);
        const location = (await getDoc(docRef)).data();
        if (location == undefined) {
            throw (`Location with id ${locationId} not found`);
        }
        Object.setPrototypeOf(location, Location.prototype);
        if (withReviews) {
            let reviews = await this.getReviewsOfLocation(locationId, withUsers);
            location.addReviews(reviews);
        }
        return location;
    }

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
                // console.log(location);
                locations.push(location);
            }
        );

        return locations;
    }

    // get all reviews
    async getAllReviews() {

        const collectionRef = collection(this.firestore, this.REVIEWS_PATH);
        const snap = await getDocs(query(collectionRef));

        let reviews = [];
        snap.forEach(
            (doc) => {
                console.log(doc.id);
                let review = doc.data();
                Object.setPrototypeOf(review, Review.prototype);
                // console.log(review);
                locations.push(review);
            }
        );

        return reviews;
    }

    // get all reviews of location with given id with the user who created the review if specified
    async getReviewsOfLocation(locationId, withUsers) {
        let reviews = [];
        const reviewsCollRef = collection(this.firestore, this.REVIEWS_PATH);
        const q = query(reviewsCollRef, where("locationId", "==", locationId));
        const querySnap = await getDocs(q);
        for (let doc of querySnap.docs) {
            let review = doc.val();
            Object.setPrototypeOf(review, Review.prototype);
            if (withUsers) {
                let user = await this.getUser(review.userId, false, false);
                review.addUser(user);
            }
            reviews.push(review);
        }
        return reviews;
    }

    // get all reviews of user with given id with the reviewed location if specified
    async getReviewsOfUser(userId, withLocations) {
        let reviews = [];
        const reviewsCollRef = collection(this.firestore, this.REVIEWS_PATH);
        const q = query(reviewsCollRef, where("userId", "==", userId));
        const querySnap = await getDocs(q);
        for (let doc of querySnap.docs) {
            let review = doc.val();
            Object.setPrototypeOf(review, Review.prototype);
            if (withLocations) {
                let location = await this.getLocation(review.locationId, false, false);
                review.addLocation(location);
            }
            reviews.push(review);
        }
        return reviews;
    }

    // add given review to review list and return the review id
    async addReview(review) {
        const collectionRef = collection(this.firestore, this.REVIEWS_PATH);
        review.clean();
        Object.setPrototypeOf(review, Object.prototype);
        return (await addDoc(collectionRef, review)).path;
        //TODO: fix path return
    }

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
import { getFirestore, collection, doc, addDoc, setDoc, getDoc, deleteDoc, query, getDocs, where } from "https://www.gstatic.com/firebasejs/9.6.9/firebase-firestore.js";
import { DBManager } from "./DBManager.js";
import { Location } from "./Location.js";
import { Review } from "./Review.js";
import { User } from "./user.js";

export class FirestoreDBManager extends DBManager {

    firestore;
    LOCATIONS_PATH = 'locations';
    REVIEWS_PATH = 'reviews';
    USERS_PATH = 'users';

    constructor(app) {
        super(app);
        this.firestore = getFirestore(app);
    }

    // add given location to locations list and return the location id
    async addLocation(location) {
        const collectionRef = collection(this.firestore, this.LOCATIONS_PATH);
        location.clear();
        Object.setPrototypeOf(location, Object.prototype);
        const id = (await addDoc(collectionRef, location)).id;
        Object.setPrototypeOf(location, Location.prototype);
        return id;
    }

    // remove location at given id
    async removeLocation(locationId) {
        const docRef = doc(this.firestore, this.LOCATIONS_PATH + "/" + locationId);
        await deleteDoc(docRef);
    }

    // set location at given id
    async setLocation(locationId, location) {
        const docRef = doc(this.firestore, this.LOCATIONS_PATH + "/" + locationId);
        location.clear();
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
        review.clear();
        Object.setPrototypeOf(review, Object.prototype);
        const id = (await addDoc(collectionRef, review)).id;
        Object.setPrototypeOf(review, Review.prototype);
        return id;
    }

    // remove review at given id
    async removeReview(reviewId) {
        const docRef = doc(this.firestore, this.REVIEWS_PATH + "/" + reviewId);
        await deleteDoc(docRef);
    }

    // set given user
    async setUser(userId, user) {
        const docRef = doc(this.firestore, this.USERS_PATH + "/" + userId);
        user.clear();
        Object.setPrototypeOf(user, Object.prototype);
        await setDoc(docRef, user);
        Object.setPrototypeOf(user, User.prototype);
    }

    // get all users
    async getAllUsers() {
        const collectionRef = collection(this.firestore, this.USERS_PATH);
        const snap = await getDocs(query(collectionRef));

        let users = [];

        snap.forEach(
            (doc) => {
                console.log(doc.id);
                let user = doc.data();
                Object.setPrototypeOf(user, User.prototype);
                // console.log(user);
                users.push(user);
            }
        );

        return users;
    }

    // get user at given id, with his reviews and with the reviewed locations if specified
    async getUser(userId, withReviews, withLocations) {
        const docRef = doc(this.firestore, this.USERS_PATH + "/" + userId);
        const user = (await getDoc(docRef)).data();
        if (user == undefined) {
            throw (`User with id ${userId} not found`);
        }

        Object.setPrototypeOf(user, User.prototype);

        if (withReviews) {
            let reviews = await this.getReviewsOfUser(userId, withLocations);
            user.addReviews(reviews);
        }
        return user;
    }

    // get review at given id, with user and reviewed location if specified
    async getReview(reviewId, withUser, withLocation) {
        const docRef = doc(this.firestore, this.REVIEWS_PATH + "/" + reviewId);
        const review = (await getDoc(docRef)).data();
        if (review == undefined) {
            throw (`Review with id ${reviewId} not found`);
        }

        Object.setPrototypeOf(review, Review.prototype);

        if (withUser) {
            let user = await this.getUser(review.userId, false, false);
            review.addUser(user);
        }

        if (withLocation) {
            let location = await this.getLocation(review.locationId, false, false);
            review.addLocation(location);
        }

        return review;
    }
}
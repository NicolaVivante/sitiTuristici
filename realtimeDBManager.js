// documentation
// https://firebase.google.com/docs/database/web/read-and-write

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.9/firebase-app.js";
import { getDatabase, ref, onValue, get, push, set, remove } from "https://www.gstatic.com/firebasejs/9.6.9/firebase-database.js";
import { DBManager } from "./DBManager.js";
import { Review } from "./review.js";
import { User } from "./user.js";
import { Location } from "./location.js";

export class RealtimeDBManager extends DBManager {

    db;
    LOCATIONS_PATH = 'locations';
    REVIEWS_PATH = 'reviews';
    USERS_PATH = 'users';

    constructor(firebaseConfig) {
        // initialize Firebase
        super(firebaseConfig);
        const app = initializeApp(firebaseConfig);
        this.db = getDatabase(app);
    }

    onDBChange(callBack) {
        let dbRef = ref(this.db);
        onValue(dbRef, snap => callBack(snap.val()));
    }

    addLocation(location) {
        let locationsRef = ref(this.db, this.LOCATIONS_PATH);
        location.clean();
        return push(locationsRef, location).key;
    }

    removeLocation(locationId) {
        let locationRef = ref(this.db, this.LOCATIONS_PATH + "/" + locationId);
        remove(locationRef);
    }

    #setLocation(locationId, location) {
        // set location at given id
        let locationRef = ref(this.db, this.LOCATIONS_PATH + "/" + locationId);
        location.clean();
        set(locationRef, location);
    }

    async getLocation(locationId, withReviews, withUsers) {
        // retrieve location
        let locationRef = ref(this.db, this.LOCATIONS_PATH + "/" + locationId);
        let locationObj = (await get(locationRef)).val();
        if (locationObj == null) {
            throw (`Location with id ${locationId} not found`);
        }

        let location = new Location();
        Object.assign(location, locationObj);

        if (withReviews) {
            let reviews = await this.getReviewsOfLocation(locationId, withUsers);
            location.addReviews(reviews);
        }

        return location;
    }

    async getAllLocations() {
        let locationsRef = ref(this.db, this.LOCATIONS_PATH);
        let locationsSnap = await get(locationsRef);
        let locations = [];
        locationsSnap.forEach(locationSnap => {
            let location = locationSnap.val()
            Object.setPrototypeOf(location, Location.prototype);
            location.addId(locationSnap.key);
            locations.push(location);
        });

        return locations;
    }

    async getAllReviews() {
        let reviewsRef = ref(this.db, this.REVIEWS_PATH);
        let allReviewsSnap = await get(reviewsRef);
        let reviews = [];
        allReviewsSnap.forEach(reviewSnap => {
            let review = reviewSnap.val()
            Object.setPrototypeOf(review, Review.prototype);
            review.addId(reviewSnap.key);
            reviews.push(review);
        });

        return reviews;
    }

    async getReviewsOfLocation(locationId, withUsers) {
        let reviewsRef = ref(this.db, this.REVIEWS_PATH);
        let allReviewsSnap = await get(reviewsRef);
        let locationReviews = [];
        await allReviewsSnap.forEach(reviewSnap => {
            let review = reviewSnap.val()
            Object.setPrototypeOf(review, Review.prototype);
            if (review.locationId == locationId) {
                review.addId(reviewSnap.key);
                locationReviews.push(review);
            }
        });

        if (withUsers) {
            for (let review of locationReviews) {
                let user = await this.getUser(review.userId, false);
                review.addUser(user);
            }
        }

        return locationReviews;
    }

    async getReviewsOfUser(userId) {
        let reviewsRef = ref(this.db, this.REVIEWS_PATH);
        let allReviewsSnap = await get(reviewsRef);
        let userReviews = [];
        allReviewsSnap.forEach(reviewSnap => {
            let review = reviewSnap.val()
            Object.setPrototypeOf(review, Review.prototype);
            if (review.userId == userId) {
                review.addId(reviewSnap.key);
                // add locationName 
                let location = this.getLocation(review.locationId, false, false);
                review.addLocationName(location.name);
                userReviews.push(review);
            }
        });
        return userReviews;
    }

    async addReview(review) {
        // get location from review locationId
        let location = await this.getLocation(review.locationId, false);
        // update location data
        location.reviewsCount++;
        location.reviewsScoreSum += review.score;
        // set location at review locarionId
        this.#setLocation(review.locationId, location);

        // add review and return id
        let reviewsRef = ref(this.db, this.REVIEWS_PATH);
        review.clean();
        return push(reviewsRef, review).key;
    }

    async removeReview(reviewId) {
        // get review from id
        let reviewsRef = ref(this.db, this.REVIEWS_PATH + "/" + reviewId);
        let review = (await get(reviewsRef)).val();

        // get location from review locationId
        let location = await this.getLocation(review.locationId);
        // update location data
        location.reviewsCount--;
        location.reviewsScoreSum -= review.score;
        // set location at review locarionId
        this.#setLocation(review.locationId, location);

        // remove review
        remove(reviewsRef);
    }

    async addUser(user, userId) {
        let userRef = ref(this.db, this.USERS_PATH + "/" + userId);
        user.clear();
        set(userRef, user);
    }

    async getAllUsers() {
        let allUsersRef = ref(this.db, this.USERS_PATH);
        let allUsersSnap = await get(allUsersRef);
        let users = [];
        allUsersSnap.forEach(userSnap => {
            let user = userSnap.val()
            Object.setPrototypeOf(user, User.prototype);
            user.addId(userSnap.key);
            users.push(user);
        });

        return users;
    }

    async getUser(userId, withReviews) {
        let userRef = ref(this.db, this.USERS_PATH + "/" + userId);
        let user = (await get(userRef)).val();
        Object.setPrototypeOf(user, User.prototype);
        if (withReviews) {
            let userReviews = await this.getReviewsOfUser(userId);
            user.addReviews(userReviews);
        }
        return user;
    }
}
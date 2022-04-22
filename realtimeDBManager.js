// documentation
// https://firebase.google.com/docs/database/web/read-and-write

import { getDatabase, ref, onValue, get, push, set, remove } from "https://www.gstatic.com/firebasejs/9.6.9/firebase-database.js";
import { DBManager } from "./DBManager.js";
import { Review } from "./Review.js";
import { User } from "./User.js";
import { Location } from "./Location.js";

export class RealtimeDBManager extends DBManager {

    db;
    LOCATIONS_PATH = 'locations';
    REVIEWS_PATH = 'reviews';
    USERS_PATH = 'users';

    constructor(app) {
        super(app);
        this.db = getDatabase(app);
    }

    onDBChange(callBack) {
        let dbRef = ref(this.db);
        onValue(dbRef, snap => callBack(snap.val()));
    }

    async addLocation(location) {
        let locationsRef = ref(this.db, this.LOCATIONS_PATH);
        location.clean();
        return push(locationsRef, location).key;
    }

    async removeLocation(locationId) {
        let locationRef = ref(this.db, this.LOCATIONS_PATH + "/" + locationId);
        remove(locationRef);
    }

    async setLocation(locationId, location) {
        // set location at given id
        let locationRef = ref(this.db, this.LOCATIONS_PATH + "/" + locationId);
        location.clean();
        await set(locationRef, location);
    }

    async getLocation(locationId, withReviews, withUsers) {
        // retrieve location
        const locationRef = ref(this.db, this.LOCATIONS_PATH + "/" + locationId);
        let location = (await get(locationRef)).val();
        if (location == null) {
            throw (`Location with id ${locationId} not found`);
        }

        Object.setPrototypeOf(location, Location.prototype);
        if (withReviews) {
            let reviews = await this.getReviewsOfLocation(locationId, withUsers);
            location.addReviews(reviews);
        }

        return location;
    }

    async getAllLocations() {
        const locationsRef = ref(this.db, this.LOCATIONS_PATH);
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
        const reviewsRef = ref(this.db, this.REVIEWS_PATH);
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
        let allReviews = (await get(reviewsRef)).val();
        let locationReviews = [];
        for (let reviewId in allReviews) {
            let review = allReviews[reviewId];
            Object.setPrototypeOf(review, Review.prototype);
            if (review.locationId == locationId) {
                review.addId(reviewId);
                if (withUsers) {
                    let user = await this.getUser(review.userId, false);
                    review.addUser(user);
                }

                locationReviews.push(review);
            }
        }
        return locationReviews;
    }

    async getReviewsOfUser(userId, withLocations) {
        let reviewsRef = ref(this.db, this.REVIEWS_PATH);
        let allReviews = (await get(reviewsRef)).val();
        let userReviews = [];
        for (let reviewId in allReviews) {
            let review = allReviews[reviewId];
            Object.setPrototypeOf(review, Review.prototype);
            if (review.userId == userId) {
                review.addId(reviewId);
                // add location
                if (withLocations) {
                    let location = await this.getLocation(review.locationId, false, false);
                    review.addLocation(location);
                }
                userReviews.push(review);
            }
        };

        return userReviews;
        // allReviewsSnap.forEach((reviewSnap) => {
        //     let review = reviewSnap.val()
        //     Object.setPrototypeOf(review, Review.prototype);
        //     if (review.userId == userId) {
        //         review.addId(reviewSnap.key);
        //         // add location
        //         if (withLocations) {
        //             let location = this.getLocation(review.locationId, false, false);
        //             review.addLocation(location);
        //         }
        //         userReviews.push(review);
        //     }
        // });
    }

    async addReview(review) {
        // get location from review locationId
        let location = await this.getLocation(review.locationId, false);
        // update location data
        location.reviewsCount++;
        location.reviewsScoreSum += parseInt(review.score);
        // set location at review locarionId
        await this.setLocation(review.locationId, location);

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
        location.reviewsScoreSum -= parseInt(review.score);
        // set location at review locarionId
        await this.setLocation(review.locationId, location);

        // remove review
        remove(reviewsRef);
    }

    async setUser(userId, user) {
        let userRef = ref(this.db, this.USERS_PATH + "/" + userId);
        user.clear();
        await set(userRef, user);
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

    async getUser(userId, withReviews, withLocations) {
        let userRef = ref(this.db, this.USERS_PATH + "/" + userId);
        let user = (await get(userRef)).val();
        if (user == null) {
            throw (`User with id ${userId} not found`);
        }
        Object.setPrototypeOf(user, User.prototype);
        if (withReviews) {
            let userReviews = await this.getReviewsOfUser(userId, withLocations);
            user.addReviews(userReviews);
        }
        return user;
    }

    async getReview(reviewId, withuser, withLocation) {
        let reviewRef = ref(this.db, this.REVIEWS_PATH + "/" + reviewId);
        let review = (await get(reviewRef)).val();
        if (review == null) {
            throw (`Review with id ${reviewId} not found`);
        }
        Object.setPrototypeOf(review, Review.prototype);
        if (withuser) {
            let user = await this.getUser(review.userId, false);
            review.addUser(user);
        }

        if (withLocation) {
            let location = await this.getLocation(review.locationId, false, false);
            review.addLocation(location);
        }

        return review;
    }
}
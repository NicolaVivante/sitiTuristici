// documentation
// https://firebase.google.com/docs/database/web/read-and-write

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.9/firebase-app.js";
import { getDatabase, ref, onValue, get, push, set, remove } from "https://www.gstatic.com/firebasejs/9.6.9/firebase-database.js";
import { DBManager } from "./DBManager.js";


export class RealtimeDBManager extends DBManager {

    db;
    LOCATIONS_PATH = 'locations';
    REVIEWS_PATH = 'reviews'

    constructor(firebaseConfig) {
        // initialize Firebase
        super(firebaseConfig);
        const app = initializeApp(firebaseConfig);
        this.db = getDatabase(app);
    }

    // call given callback each time db changes
    onDBChange(callBack) {
        let dbRef = ref(this.db);
        onValue(dbRef, snap => callBack(snap.val()));
    }

    // call given callback each time the locations list changes
    onLocationsChange(callBack) {
        let locationsRef = ref(this.db, this.LOCATIONS_PATH);
        onValue(locationsRef, locations => callBack(locations.val()));
    }

    // add given location to locations list and return the location id
    addLocation(location) {
        let locationsRef = ref(this.db, this.LOCATIONS_PATH);
        return push(locationsRef, location).key;
    }

    // remove location at given id
    removeLocation(locationId) {
        let locationRef = ref(this.db, this.LOCATIONS_PATH + "/" + locationId);
        remove(locationRef);
    }

    // set location at given id
    #setLocation(locationId, location) {
        // set location at given id
        let locationRef = ref(this.db, this.LOCATIONS_PATH + "/" + locationId);
        set(locationRef, location);
    }

    // get location with given id
    async getLocation(locationId) {
        let locationRef = ref(this.db, this.LOCATIONS_PATH + "/" + locationId);
        let locationSnap = (await get(locationRef)).val();
        Object.setPrototypeOf(location, Location.prototype);

        return locationSnap;
    }

    // add given review to review list and return the review id
    addReview(review) {
        // get location from review locationId
        // update location scoreSum and reviewsCount
        // set location at review locarionId

        // add review
        // return review id
    }

    // remove revierw at given id
    removeReview(reviewId) {
        // remove revierw at given id
    }
}
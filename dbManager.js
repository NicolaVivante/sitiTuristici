export class DBManager {

    constructor(firebaseConfig) {
        // initialize Firebase
        //const app = initializeApp(firebaseConfig);
        //this.db = getDatabase(app);
    }

    // call given callback each time db changes
    onDBChange(callBack) {}

    // add given location to locations list and return the location id
    addLocation(location) {}

    // remove location at given id
    removeLocation(locationId) {}

    // set location at given id
    #setLocation(locationId, location) {}

    // get location with given id
    getLocation(locationId) {}

    // return an array of all locations
    getAllLocations() {}

    // get reviews with given location id
    getReviewsOfLocation(locationId) {}

    // get reviews from given user id
    getReviewsOfUser(userId) {}

    // add given review to review list and return the review id
    addReview(review) {}

    // remove revierw at given id
    removeReview(reviewId) {}
}
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

    orderLocationsByLetter(locations, flip) {
        locations.sort(function(x, y) {
            return x.name.localeCompare(y.name);
        });

        if (flip) {
            locations.reverse();
        }
    }

    orderLocationsByScore(locations, flip) {
        locations.sort(function(x, y) {
            return y.getAvgScore() - x.getAvgScore();
        });

        if (flip) {
            locations.reverse();
        }
    }

    orderLocationsByReviewsCount(locations, flip) {
        locations.sort(function(x, y) {
            return y.reviewsCount - x.reviewsCount;
        });

        if (flip) {
            locations.reverse();
        }
    }

    
}
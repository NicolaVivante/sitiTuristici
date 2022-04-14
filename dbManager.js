export class DBManager {

    constructor(app) {
        // initialize Firebase
        //const app = initializeApp(firebaseConfig);
        //this.db = getDatabase(app);
    }

    // call given callback each time db changes
    onDBChange(callBack) { }

    // add given location to locations list and return the location id
    addLocation(location) { }

    // remove location at given id
    removeLocation(locationId) { }

    // set location at given id
    #setLocation(locationId, location) { }

    // get location with given id, with reviews if specified
    async getLocation(locationId, withReviews, withUsers) { }

    // get all locations
    async getAllLocations() { }

    // get all reviews
    async getAllReviews() { }

    // get all reviews of location with given id with the user who created the review if specified
    async getReviewsOfLocation(locationId, withUsers) { }

    // add given review to review list and return the review id
    async addReview(review) { }

    // remove review at given id
    async removeReview(reviewId) { }

    // add given user to users list and return the id
    addUser(user) { }

    // get all users
    async getAllUsers() { }

    // order given locations by name, reverse array if specified
    orderLocationsByName(locations, flip) {
        locations.sort(function (x, y) {
            return x.name.localeCompare(y.name);
        });

        if (flip) {
            locations.reverse();
        }
    }

    // order given locations by avarage score, reverse array if specified
    orderLocationsByScore(locations, flip) {
        locations.sort(function (x, y) {
            return y.getAvgScore() - x.getAvgScore();
        });

        if (flip) {
            locations.reverse();
        }
    }

    // order given locations by number of reviews, reverse array if specified
    orderLocationsByReviewsCount(locations, flip) {
        locations.sort(function (x, y) {
            return y.reviewsCount - x.reviewsCount;
        });

        if (flip) {
            locations.reverse();
        }
    }

    // order given reviews by score, reverse array if specified
    orderReviewsByScore(reviews, flip) {
        reviews.sort(function (x, y) {
            return y.score - x.score;
        });

        if (flip) {
            reviews.reverse();
        }
    }

    // order given reviews by less recent, reverse array if specified
    orderReviewsByTime(reviews, flip) {
        reviews.sort(function (x, y) {
            return y.date - x.date;
        });

        if (flip) {
            reviews.reverse();
        }
    }
}
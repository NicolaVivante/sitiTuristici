export class Location {
    name;
    location;
    reviewsCount;
    reviewsScoreSum;

    constructor(name, location) {
        this.name = name;
        this.location = location;
        this.reviewsCount = 0;
        this.reviewsScoreSum = 0;
    }

    clean() {
        this["reviews"] = null;
        this["id"] = null;
    }

    getAvgScore() {
        return this.reviewsScoreSum / this.reviewsCount;
    }

    addReviews(reviews) {
        this["reviews"] = reviews;
    }

    getReviews() {
        return this["reviews"];
    }

    addId(id) {
        this["id"] = id;
    }

    getId() {
        return this["id"];
    }
}


  
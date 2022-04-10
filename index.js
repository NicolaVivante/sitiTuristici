class Location {
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

    getAvgScore() {
        return this.reviewsScoreSum / this.reviewsCount;
    }

    getReviewsCount() {
        return this.reviewsCount;
    }

    addReview(value) {
        if (value < 0 || value > 5) {
            throw new Error('Review score out of range');
        }
        this.reviewsScoreSum += value;
        this.reviewsCount++;
    }

    removeReview(value) {
        if (value < 0 || value > 5) {
            throw new Error('Review score out of range');
        }
        this.reviewsScoreSum -= value;
        this.reviewsCount--;
    }
}


test = new Location("sus", "sos");
console.log(JSON.stringify(test));
test.addReview(5);
console.log(JSON.stringify(test));
test.addReview(3);
console.log(JSON.stringify(test));
console.log(test.getAvgScore())
test.removeReview(5);
console.log(JSON.stringify(test));
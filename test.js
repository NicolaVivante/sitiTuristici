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

// from google docs https://developers.google.com/maps/documentation/javascript/overview#maps_map_simple-javascript
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
    });
}

// test = new Location("sos", { lat: -34.397, lng: 150.644 });
// console.log(JSON.stringify(test));
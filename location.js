export class Location {
    name;
    position;
    reviewsCount;
    reviewsScoreSum;

    constructor(name, position) {
        this.name = name;
        this.position = position;
        this.reviewsCount = 0;
        this.reviewsScoreSum = 0;
    }

    clean() {
        this["reviews"] = null;
        this["id"] = null;
    }

    getAvgScore() {
        if (this.reviewsCount == 0) {
            return 0;
        }
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

    addDescription(description) {
        this["description"] = description;
    }

    getDescription() {
        return this["description"];
    }

    addContact(contact) {
        if ("contacts" in this) {
            this["contacts"].push(contact);
        } else {
            this["contacts"] = [contact];
        }
    }

    getContacts() {
        return this["contacts"];
    }
}
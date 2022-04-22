export class User {
    name;
    registrationDate;

    constructor(name) {
        this.name = name;
        this.registrationDate = Date.now();
    }

    clear() {
        this["id"] = null;
        this["reviews"] = null;
    }

    addId(userId) {
        this["id"] = userId;
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

    addReviews(reviews) {
        this["reviews"] = reviews;
    }

    getReviews() {
        return this["reviews"];
    }

    isAdmin() {
        return this["admin"] != null;
    }
}

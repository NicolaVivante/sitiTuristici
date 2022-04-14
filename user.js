export class User {
    name;
    registrationDate;

    constructor(name, email) {
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

    addPhoto(photoRef) {
        this["photo"] = photoRef;
    }

    getPhoto() {
        return this["photo"];
    }

    addReviews(reviews) {
        this["reviews"] = reviews;
    }

    getReviews() {
        return this["reviews"];
    }
}
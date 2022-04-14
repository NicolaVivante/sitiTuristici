export class User {
    name;
    email;
    password;
    registrationDate;

    constructor(name, email, password) {
        this.name = name;
        this.email = email;
        this.password = password;
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
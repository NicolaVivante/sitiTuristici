export class Review {
    locationId;
    userId;
    title;
    score;
    timestamp;

    constructor(locationId, userId, title, score) {
        this.locationId = locationId;
        this.userId = userId;
        this.title = title;
        if (score < 0 || score > 5) {
            throw ("Review score must be in [0-5] range");
        }
        this.score = score;
        this.timestamp = Date.now();
    }

    clean() {
        this["user"] = null;
        this["id"] = null;
        this["location"] = null;
    }

    addDescription(description) {
        this["description"] = description;
    }

    getDescription() {
        return this["description"];
    }

    addUser(user) {
        this["user"] = user;
    }

    getUser() {
        return this["user"];
    }

    addId(id) {
        this["id"] = id;
    }

    getId() {
        return this["id"];
    }

    addLocation(location) {
        this["location"] = location;
    }

    getLocation() {
        return this["location"];
    }
}
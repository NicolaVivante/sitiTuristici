export class Review {
    locationId;
    userId;
    title;
    score;
    date;

    constructor(locationId, userId, title, score) {
        this.locationId = locationId;
        this.userId = userId;
        this.title = title;
        //TODO: add score range check
        if (score < 0 || score > 5) {
            throw("Review score must be in [0-5] range");
        }
        this.score = score;
        this.date = Date.now();
    }
}
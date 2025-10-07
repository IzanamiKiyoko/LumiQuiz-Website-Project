class Room {
    constructor(pin, host, players, hidePin, timePerSlide, minusPoint, isPlayWith, quiz) {
        this.pin = pin;
        this.host = host;
        this.players = players;
        this.hidePin = hidePin;
        this.timePerSlide = timePerSlide;
        this.minusPoint = minusPoint;
        this.isPlayWith = isPlayWith;
        this.quiz = quiz;
    }

    detail() {
        return {
            pin: this.pin,
            host: this.host,
            players: Object.values(this.players),
            hidePin: this.hidePin,
            isPlayWith: this.isPlayWith,
            quiz: this.quiz
        };
    }

    setting() {
        return {
            timePerSlide: this.timePerSlide,
            minusPoint: this.minusPoint
        };
    }
}

export default Room;

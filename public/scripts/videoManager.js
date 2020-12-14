export default class VideoManager {
    players = [];
    transitions = [null];
    transitionDuration = 0;
    loadingOutro = false;

    constructor(player1, player2) {
        this.players.push(player1);
        this.players.push(player2);
    }

    loadedMetadata(playerIndex) {
        // If current video player is loading outro, we must add no more transitions
        if (this.loadingOutro) return;
        console.log("Metadata index " + playerIndex + " duration " + this.players[playerIndex].duration);
        if (this.transitions[0] === null) {
            if (playerIndex === 0) {
                // First video (intro) is loaded, prepare first transition
                this.transitions[0] = {time: this.players[playerIndex].duration, scheduled: true};
                this.scheduleFirstTransition(this.transitions[0]);
            } else {
                this.transitions[1] = {time: this.players[playerIndex].duration, scheduled: false};
            }
        } else {
            this.transitions.push({time: this.players[playerIndex].duration, scheduled: false});
        }
        console.table(this.transitions);
    }

    scheduleFirstTransition = (transition) => {
        console.log("==> first transition: " + transition.time + " " + transition.scheduled);
        const delay = (transition.time - this.transitionDuration / 2) * 1000;
        setTimeout(() => {
            transitionPlayer.play();
            this.scheduleNextTransition();
        }, delay);
    }

    scheduleNextTransition = () => {
        const nextTransition = this.transitions[this.transitions.length - 1];
        console.log("==> next transition " + nextTransition.time + " " + nextTransition.scheduled);
        const delay = nextTransition.time * 1000;
        if (!nextTransition.scheduled) {
            setTimeout(() => {
                transitionPlayer.play();
                this.scheduleNextTransition();
            }, delay);
        }
        nextTransition.scheduled = true;
    }
}
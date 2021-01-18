
export default class VideoManager {
    players = [];
    transitions = [null];
    transitionDuration = 0;
    loadingOutro = false;
    // Transitions const 
    // transitionlength = 2800
    introLength = 10664
    transitionOverlap = 600
    breakBetweenTwoVideos = 400


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
            } else {
                this.transitions[1]  = {time: this.players[playerIndex].duration, scheduled: false};
            }
        } else {
            this.transitions.push({time: this.players[playerIndex].duration, scheduled: false});
        }
        console.table(this.transitions);
    }


    startTransitionTimeOutOnPlay = (videoRank) => {
        if(videoRank <= this.transitions.length){
            if(videoRank ==1){
                // First transition
                const delay = this.introLength - this.transitionOverlap;
                setTimeout(() => {
                    transitionPlayer.play();
                }, delay);
                return
            }if(videoRank >=1) {
                // Other Transitions 
                const delay = this.transitions[videoRank-1].time *1000 - this.transitionOverlap
                setTimeout(() =>{
                    transitionPlayer.play();
                },delay)
            }
        }

    }
}

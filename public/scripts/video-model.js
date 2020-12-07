export class Video {
    constructor(name, clips, overlayUrl, introUrl, outroUrl, transitionUrl) {
        this.name = name ? name : "";
        this.clips = clips ? clips : [] ;
        this.overlayUrl = overlayUrl ? overlayUrl : "";
        this.introUrl = introUrl ? introUrl : "";
        this.outroUrl = outroUrl ? outroUrl : "";
        this.transitionUrl = transitionUrl ? transitionUrl : "";
    }
}
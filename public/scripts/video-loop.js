//***********************//
// Video loop            //
//***********************//

import { hide, show } from "./elements.js";
import { loadChosenVideo, loadVideo } from "./video-persistence.js";
import VideoManager from "./videoManager.js";

// default values
const DEFAULT_OVERLAY_URL = window.location.origin + window.location.pathname.replace("video", "overlay");
const DEFAULT_INTRO_OUTRO_URL = "https://studiorenegade.fr/static/goupilation/generique.mp4";
const DEFAULT_TRANSITION_URL = "https://studiorenegade.fr/static/goupilation/transition.webm";

let video = null;
let overlayUrl = DEFAULT_OVERLAY_URL;
let introUrl = DEFAULT_INTRO_OUTRO_URL;
let outroUrl = DEFAULT_INTRO_OUTRO_URL;
let transitionUrl = DEFAULT_TRANSITION_URL;

// read video definition either from the url query or from the local storage 
const getVideo = () => {
  loadChosenVideo().then(goup => {
    video = goup;
    if (goup.overlayUrl) overlayUrl = goup.overlayUrl;
    if (goup.introUrl) introUrl = goup.introUrl;
    if (goup.outroUrl) outroUrl = goup.outroUrl;
    if (goup.transitionUrl) transitionUrl = goup.transitionUrl;

    initVideoPlayers();
  });
}

let transitionPlayer;
let videoIndex;
let videoManager;

// players initialization
const initVideoPlayers = () => {
  if (video.clips.length > 0) {
    // init members
    const videoPlayer1 = document.getElementById("videoPlayer1");
    const videoPlayer2 = document.getElementById("videoPlayer2");
    videoManager = new VideoManager(videoPlayer1, videoPlayer2)

    transitionPlayer = document.getElementById("transitionPlayer");
    transitionPlayer.src = transitionUrl;
    transitionPlayer.load();

    videoIndex = 0;

    // set event handlers
    videoPlayer2.addEventListener("ended", () => videoLoopHandler(0, 1));
    videoPlayer1.addEventListener("ended", () => videoLoopHandler(1, 0));

    videoPlayer2.addEventListener("loadedmetadata", () => videoManager.loadedMetadata(1));
    videoPlayer1.addEventListener("loadedmetadata", () => videoManager.loadedMetadata(0));

    videoPlayer1.addEventListener("play", ()=> videoManager.startTransitionTimeOutOnPlay(videoIndex) )
    videoPlayer2.addEventListener("play", ()=> videoManager.startTransitionTimeOutOnPlay(videoIndex) )

    // start the loop once the transition video is available
    transitionPlayer.addEventListener("loadedmetadata", () => {
      videoManager.transitionDuration = transitionPlayer.duration;
      videoLoopHandler(0, 1);
    });
    
  } else {
    alert("Select clips using clips.html first");
  }
};

// video loop

const videoLoopHandler = (runningIndex, preloadIndex) => {
  
  const runningPlayer = videoManager.players[runningIndex];
  const preloadPlayer = videoManager.players[preloadIndex];
  console.log("*** " + videoIndex + " *** " + videoManager.players.length + " r " + runningIndex + " p " + preloadIndex);
  if(videoIndex > video.clips.length + 1) return;

  if(videoIndex == 0) {
    runningPlayer.src = introUrl;
    runningPlayer.load();
  }

  // play next video
  show(runningPlayer);
  hide(preloadPlayer);
  setTimeout(()=>{
    runningPlayer.play();
  },videoManager.breakBetweenTwoVideos)

  // show overlay
  const videoOverlay = document.getElementById("overlay-container");
  if(videoIndex >= 1 && videoIndex <= video.clips.length) {
    const clip = video.clips[videoIndex - 1];
    const title = encodeURIComponent(clip.title);
    const creator = encodeURIComponent(clip.creator_name);
    const date = encodeURIComponent(clip.created_at);
    const views = encodeURIComponent(clip.view_count);

    videoOverlay.src = `${overlayUrl}?title=${title}&creator=${creator}&date=${date}&views=${views}`;
    show(videoOverlay);

  } else {
    hide(videoOverlay);
  }

  // load following clip/video
  if(videoIndex < video.clips.length) {
    preloadPlayer.src = getClipVideoURL(video.clips[videoIndex]);
  } else {
    videoManager.loadingOutro = true;
    preloadPlayer.src = outroUrl;
  }
  preloadPlayer.load();

  console.log("*** runningPlayer: " + runningPlayer.id + " " + runningPlayer.src);
  console.log("*** preloadPlayer: " + preloadPlayer.id + " " + preloadPlayer.src);
  videoIndex++;
};

const getClipVideoURL = (clip) => {
  const index = clip.thumbnail_url.indexOf("-preview-");
  return clip.thumbnail_url.substring(0, index) + ".mp4";
};

window.addEventListener("load", getVideo);


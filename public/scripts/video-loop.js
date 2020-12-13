//***********************//
// Video loop            //
//***********************//

import { hide, show } from "./elements.js";
import { loadVideo } from "./video-persistence.js";

// default values
const DEFAULT_OVERLAY_URL = window.location.origin + window.location.pathname.replace("video", "overlay");
const DEFAULT_INTRO_OUTRO_URL = "https://firebasestorage.googleapis.com/v0/b/goupilation.appspot.com/o/media%2Fgenerique.mp4?alt=media&token=94374b9a-27fc-43a8-ac5f-6f3b252f0771";
const DEFAULT_TRANSITION_URL = "https://firebasestorage.googleapis.com/v0/b/goupilation.appspot.com/o/media%2Ftransition.webm?alt=media&token=c991e809-5b4e-4604-819c-84a1913968c0";

// read video definition either from the url query or from the local storage 
const getVideo = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  
  if(urlParams.get("video")) {
    return JSON.parse(urlParams.get("video"));
  } else {
    return loadVideo("video");
  }
}

// video definition
const video = getVideo();
const overlayUrl = video.overlayUrl ? video.overlayUrl : DEFAULT_OVERLAY_URL;
const introUrl = video.introUrl ? video.introUrl : DEFAULT_INTRO_OUTRO_URL;
const outroUrl = video.outroUrl ? video.outroUrl : DEFAULT_INTRO_OUTRO_URL;
const transitionUrl = video.transitionUrl ? video.transitionUrl : DEFAULT_TRANSITION_URL;

let transitionPlayer;
let videoIndex;

// players initialization
const initVideoPlayers = () => {
  if (video.clips.length > 0) {
    // init members
    const videoPlayer1 = document.getElementById("videoPlayer1");
    const videoPlayer2 = document.getElementById("videoPlayer2");

    transitionPlayer = document.getElementById("transitionPlayer");
    transitionPlayer.src = transitionUrl;
    transitionPlayer.load();

    videoIndex = 0;

    // set event handlers
    videoPlayer1.addEventListener("ended", () => videoLoopHandler(videoPlayer2, videoPlayer1));
    videoPlayer2.addEventListener("ended", () => videoLoopHandler(videoPlayer1, videoPlayer2));

    // start the loop once the transition video is available
    transitionPlayer.onloadedmetadata = () => {
      videoLoopHandler(videoPlayer1, videoPlayer2);
    };
    
  } else {
    alert("Select clips using clips.html first");
  }
};

// video loop
const videoLoopHandler = (runningPlayer, preloadPlayer) => {
  console.log("*** " + videoIndex + " ***");
  if(videoIndex > video.clips.length + 1) return;

  // transition
  const transitionHandler = () => {
    console.log("==> transition: " + this.id + " " + this.src + " " + this.duration * 1000 + " " + transitionPlayer.duration);
    //const delay = (runningPlayer.duration - transitionPlayer.duration/2) * 1000;
    //setTimeout(() => transitionPlayer.play(), delay);
  };
  runningPlayer.onloadedmetadata = transitionHandler.bind(runningPlayer);

  if(videoIndex == 0) {
    runningPlayer.src = introUrl;
    runningPlayer.load();
  }

  // play next video
  show(runningPlayer);
  hide(preloadPlayer);
  runningPlayer.play();

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

window.addEventListener("load", initVideoPlayers);
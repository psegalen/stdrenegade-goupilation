//***********************//
// Video loop            //
//***********************//

import { hide, show } from "./elements.js";
import { loadVideo } from "./video-persistence.js";

// default values
const DEFAULT_OVERLAY_URL = location.href.replace("video", "overlay");
const DEFAULT_INTRO_OUTRO_URL = "https://firebasestorage.googleapis.com/v0/b/goupilation.appspot.com/o/media%2Fgenerique.mp4?alt=media&token=94374b9a-27fc-43a8-ac5f-6f3b252f0771";
const DEFAULT_TRANSITION_URL = "https://firebasestorage.googleapis.com/v0/b/goupilation.appspot.com/o/media%2Ftransition.mp4?alt=media&token=cee192d9-0897-408a-b5ca-03d8e410f498";

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
let video = getVideo();
let overlayUrl = video.overlayUrl ? video.overlayUrl : DEFAULT_OVERLAY_URL;
let introUrl = video.introUrl ? video.introUrl : DEFAULT_INTRO_OUTRO_URL;
let outroUrl = video.outroUrl ? video.outroUrl : DEFAULT_INTRO_OUTRO_URL;
let transitionUrl = video.transitionUrl ? video.transitionUrl : DEFAULT_TRANSITION_URL;

let videoIndex;

// video players and overlay
let videoPlayer1, videoPlayer2;
let videoSource1, videoSource2;
let videoOverlay;

// players initialization
const initVideoPlayers = () => {
  if (video.clips.length > 0) {
    // init members
    videoOverlay = document.getElementById("overlay-container");
    videoPlayer1 = document.getElementById("player1");
    videoPlayer2 = document.getElementById("player2");
    videoIndex = 0;

    // create video sources
    videoSource1 = addVideoSource(videoPlayer1, introUrl);
    videoSource2 = addVideoSource(videoPlayer2, transitionUrl);

    // set event handlers
    videoPlayer1.addEventListener("ended", clipEndedHandler);
    videoPlayer2.addEventListener("ended", transitionEndedHandler);

    // load videos
    videoPlayer1.load();
    videoPlayer2.load();

    // set play event
    show(videoPlayer1);
    videoPlayer1.play();

  } else {
    alert("Select clips using clips.html first");
  }
};

const addVideoSource = (videoPlayer, source) => {
  const videoSource = document.createElement("source");
  videoSource.setAttribute("type", "video/mp4");
  videoSource.src = source;

  videoPlayer.appendChild(videoSource);

  return videoSource;
};

// clip ended: play transition and load next clip
const clipEndedHandler = () => {
  // start transition
  show(videoPlayer2);
  hide(videoPlayer1);
  hide(videoOverlay);

  videoPlayer2.play();

  // load next clip/video
  if (videoIndex < video.clips.length) {
    nextClip(videoSource1);
  } else {
    videoSource1.src = outroUrl;
    videoPlayer1.removeEventListener("ended", clipEndedHandler);
  }
  videoPlayer1.load();
};

// transition ended: play next clip
const transitionEndedHandler = () => {
  // start next clip/video
  show(videoPlayer1);
  hide(videoPlayer2);

  if (isClipURL(videoSource1.src)) {
    show(videoOverlay);
  } else {
    hide(videoOverlay);
  }

  videoPlayer1.play();
};

// clip functions
const nextClip = (videoSource) => {
  const clip = video.clips[videoIndex];
  const title = encodeURIComponent(clip.title);
  const creator = encodeURIComponent(clip.creator_name);
  const date = encodeURIComponent(clip.created_at);

  videoSource.src = getClipVideoURL(clip);
  videoOverlay.src = `${overlayUrl}?title=${title}&creator=${creator}&date=${date}`;

  videoIndex++;
};

const getClipVideoURL = (clip) => {
  const index = clip.thumbnail_url.indexOf("-preview-");
  return clip.thumbnail_url.substring(0, index) + ".mp4";
};

const isClipURL = (url) => {
  return url.startsWith("https://clips");
};

window.addEventListener("load", initVideoPlayers);
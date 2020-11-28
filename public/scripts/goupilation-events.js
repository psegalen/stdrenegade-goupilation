//***********************//
// Video loop            //
//***********************//

import { clips, hide, setClips, show } from "./elements.js";
import { getSavedClips } from "./persistence.js";

let videoPlayer1, videoPlayer2;
let videoSource1, videoSource2;
let videoOverlay;

let videoIndex;

const initVideoPlayers = () => {
  setClips(getSavedClips("goupilation"));

  if (clips.data.length > 0) {
    // init members
    videoOverlay = document.getElementById("overlay");
    videoPlayer1 = document.getElementById("player1");
    videoPlayer2 = document.getElementById("player2");
    videoIndex = 0;

    // create video sources
    videoSource1 = addVideoSource(
      videoPlayer1,
      "https://firebasestorage.googleapis.com/v0/b/goupilation.appspot.com/o/media%2Fgenerique.mp4?alt=media&token=94374b9a-27fc-43a8-ac5f-6f3b252f0771"
    );
    videoSource2 = addVideoSource(
      videoPlayer2,
      "https://firebasestorage.googleapis.com/v0/b/goupilation.appspot.com/o/media%2Ftransition.mp4?alt=media&token=cee192d9-0897-408a-b5ca-03d8e410f498"
    );

    // set event handlers
    videoPlayer1.addEventListener("ended", clipEndedHandler);
    videoPlayer2.addEventListener("ended", transitionEndedHandler);

    // load videos
    videoPlayer1.load();
    videoPlayer2.load();

    // set play event
    document.onkeydown = () => {
      show(videoPlayer1);
      videoPlayer1.play();
      document.onkeydown = null;
    };
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

const clipEndedHandler = () => {
  // start transition
  show(videoPlayer2);
  hide(videoPlayer1);
  hide(videoOverlay);

  videoPlayer2.play();

  // load next clip/video
  if (videoIndex < clips.data.length) {
    nextClip(videoSource1);
  } else {
    videoSource1.src =
      "https://firebasestorage.googleapis.com/v0/b/goupilation.appspot.com/o/media%2Fgenerique.mp4?alt=media&token=94374b9a-27fc-43a8-ac5f-6f3b252f0771";
    videoPlayer1.removeEventListener("ended", clipEndedHandler);
  }
  videoPlayer1.load();
};

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

const nextClip = (videoSource) => {
  const clip = clips.data[videoIndex];
  videoSource.src = getClipVideoURL(clip);
  videoOverlay.innerHTML =
    clip.title + " - Clipped by " + clip.creator_name;
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

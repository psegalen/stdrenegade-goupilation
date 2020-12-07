//***********************//
// Manage persistence    //
//***********************//

import { Video } from "./video-model.js";

export const saveVideo = (video) => {
  localStorage.setItem(`save:${video.name}`, JSON.stringify(video));
};

export const loadVideo = (name) => {
  const savedVideo = localStorage.getItem(`save:${name}`);
  if (savedVideo == null) {
    return new Video();
  } else {
    return JSON.parse(savedVideo);
  }
};

export const deleteVideo = (name) => {
  localStorage.removeItem(`save:${name}`);
};

export const getSaveNames = () => {
  const keys = Object.keys(localStorage);
  const names = [];
  for (let key of keys) {
    if (key.startsWith("save:")) names.push(key.substring(5));
  }
  return names.sort();
};
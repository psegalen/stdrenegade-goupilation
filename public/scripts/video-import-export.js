//***********************//
// Import / Export       //
//***********************//

import { getById, hide, show } from "./elements.js";
import { loadVideo, getSaveNames } from "./video-persistence.js";


//***********************//
// Dialog boxes          //
//***********************//

export const showImportDialog = () => {
  let textInput = getById("import-export-input");
  textInput.value = "";

  let confirmButton = getById("import-export-confirm");
  confirmButton.addEventListener("click", importAllSaves);

  let cancelButton = getById("import-export-cancel");
  show(cancelButton);

  show(getById("import-export-dialog"), "flex");
}

export const showExportDialog = () => {
  exportDialog(exportAllSaves());
}

export const showShareDialog = () => {
  let video = loadVideo("video");

  // filter data
  const propertiesToKeep = ["creator_name", "title", "view_count", "created_at", "thumbnail_url"];
  for(let clip of video.clips) {
    for(let key in clip) {
      if(!propertiesToKeep.includes(key)) {
        delete clip[key];
      }
    }
  }

  // create url
  const rootUrl = window.location.origin + window.location.pathname.replace("clips", "video");
  const videoComponent = JSON.stringify(video);
  const videoUrl = `${rootUrl}?video=${encodeURIComponent(videoComponent)}`;

  const nl = String.fromCharCode(13);
  const shareContent = `Share URL:${nl}${videoUrl}${nl}${nl}JSON:${nl}${videoComponent}`;
  exportDialog(shareContent);
}

export const hideImportExportDialog = () => {
  hide(getById("import-export-dialog"));
}


//***********************//
// Private functions     //
//***********************//

const exportDialog = (content) => {
  let confirmButton = getById("import-export-confirm");
  confirmButton.addEventListener("click", hideImportExportDialog);

  let cancelButton = getById("import-export-cancel");
  hide(cancelButton);

  getById("import-export-input").value = content;

  show(getById("import-export-dialog"), "flex");
}

const exportAllSaves = () => {
  const saveNames = getSaveNames();

  const allSaves = {};
  for (let name of saveNames) {
    allSaves[name] = loadVideo(name);
  }

  return JSON.stringify(allSaves);
};

const importAllSaves = (allSaves) => {
  const input = getById("import-export-input");
  const json = input.value;

  allSaves = JSON.parse(json);
  for (let key in allSaves) {
    localStorage.setItem("save:" + key, JSON.stringify(allSaves[key]));
  }

  input.value = "";
};
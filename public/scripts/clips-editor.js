//***********************//
// Clips editor          //
//***********************//

import { getById, getValueById, show, hide, addContent } from "./elements.js";
import { fetchClips } from "./twitch.js";
import { showShareDialog } from "./video-import-export.js";
import { loadVideo, saveVideo, deleteVideo, getSaveNames } from "./video-persistence.js";
import { ClipsTable } from "./clips-table.js";
import { Video } from "./video-model.js";


//***********************//
// Members               //
//***********************//

const createClipsTable = (parentId) => {
  return new ClipsTable(parentId, document.getElementById(parentId));
}

let remoteClipsTable = createClipsTable("remote-clips-table");
let localClipsTable = createClipsTable("local-clips-table");
let video = new Video();


//***********************//
// Fetch                 //
//***********************//

export const submitDates = () => {
  const startDate = getById("start_date").value + "T00:00:00Z";
  const endDate = getById("end_date").value + "T23:59:59Z";

  fetchClips(startDate, endDate).then((clips) => {
    // filter data
    const propertiesToKeep = ["url", "creator_name", "title", "view_count", "created_at", "thumbnail_url"];
    for(let clip of clips.data) {
      for(let key in clip) {
        if(!propertiesToKeep.includes(key)) {
          delete clip[key];
        }
      }
    }

    // refresh remote clips table with filtered data
    remoteClipsTable.refresh(clips.data);
  });
}

export const addSelectedClips = () => {
  const localClips = localClipsTable.clips;
  const remoteClips = remoteClipsTable.getSelection();
  const concatClips = localClips.concat(remoteClips);

  localClipsTable.refresh(concatClips);
}


//***********************//
// Save                  //
//***********************//

export const showSaveDialog = () => {
  getById("save-name").value = video.name;
  getById("save-overlay").value = video.overlayUrl;
  getById("save-intro").value = video.introUrl;
  getById("save-outro").value = video.outroUrl;
  getById("save-transition").value = video.transitionUrl;

  show(getById("save-dialog"), "flex");
}

export const hideSaveDialog = () => {
  hide(getById("save-dialog"));
}

export const performSave = () => {
  save();
}

export const performSelect = () => {
  save("video");
  hideSaveDialog();
  showShareDialog();
}

const save = (name) => {
  localClipsTable.refresh();

  video.clips = localClipsTable.clips;
  video.name = name ? name : getValueById("save-name");
  video.overlayUrl = getValueById("save-overlay");
  video.introUrl = getValueById("save-intro");
  video.outroUrl = getValueById("save-outro");
  video.transitionUrl = getValueById("save-transition");

  saveVideo(video);
  hideSaveDialog();
}


//***********************//
// Load                  //
//***********************//

export const showLoadDialog = () => {
  const saveNames = getSaveNames();
  const nameCombo = getById("load-name");

  nameCombo.innerHTML = "";
  for(let name of saveNames) {
    addContent(nameCombo, "option", name, [{key: "value", value: name}]);
  }

  show(getById("load-dialog"), "flex");
}

export const hideLoadDialog = () => {
  hide(getById("load-dialog"));
}

export const performLoad = () => {
  video = loadVideo(getValueById("load-name"));
  localClipsTable.refresh(video.clips);
  hide(getById("load-dialog"));
}


//***********************//
// Delete                //
//***********************//

export const showDeleteDialog = () => {
  const saveNames = getSaveNames();
  const nameCombo = getById("delete-name");

  nameCombo.innerHTML = "";
  for(let name of saveNames) {
    addContent(nameCombo, "option", name, [{key: "value", value: name}]);
  }

  show(getById("delete-dialog"), "flex");
}

export const hideDeleteDialog = () => {
  hide(getById("delete-dialog"));
}

export const performDelete = () => {
  const name = getValueById("delete-name");
  deleteVideo(name);
  showDeleteDialog();
}
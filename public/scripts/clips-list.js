//***********************//
// Clips list            //
//***********************//

import { getById, getValueById, addContent } from "./elements.js";
import { fetchClips } from "./twitch.js";
import { loadClips, saveClips, deleteClips, getSaveNames } from "./clips-persistence.js";
import { ClipsTable } from "./clips-table.js";

let remoteClipsTable, localClipsTable;

export const submitDates = () => {
  const startDate = getById("start_date").value + "T00:00:00Z";
  const endDate = getById("end_date").value + "T23:59:59Z";

  fetchClips(startDate, endDate).then((clips) => {
    remoteClipsTable = createClipsTable("remote-clips-table", clips);
    remoteClipsTable.render();
  });
};

export const addSelectedClips = () => {
  const localClips = localClipsTable.clips;
  const remoteClips = remoteClipsTable.getSelection();
  const concatClips = {data: localClips.data.concat(remoteClips.data)};

  localClipsTable.refresh(concatClips);
};

export const saveSelectedClips = () => {
  localClipsTable.refresh();
  saveClips(getValueById("save-input"), localClipsTable.clips);
  loadSaveList();
};

export const saveClipsForVideo = () => {
  localClipsTable.refresh();
  saveClips("video", localClipsTable.clips);
  loadSaveList();
};

export const loadSavedClips = () => {
  const clips = loadClips(getValueById("save-input"));
  localClipsTable = createClipsTable("local-clips-table", clips);
  localClipsTable.render();
};

export const deleteSavedClips = () => {
  const saveInput = getById("save-input");
  deleteClips(saveInput.value);
  loadSaveList();
  saveInput.value = "";
};

export const loadSaveList = () => {
  const saveNames = getSaveNames();

  const saveList = document.getElementById("save-list");
  saveList.innerHTML = "";

  for (let name of saveNames) {
    let opt = addContent(saveList, "option");
    opt.setAttribute("value", name);
  }
};

const createClipsTable = (parentId, json) => {
  let clipsTable = new ClipsTable(parentId, document.getElementById(parentId));
  clipsTable.feed(json);
  return clipsTable;
};
//***********************//
// Clips list            //
//***********************//

import { getById, getValueById, addContent } from "./elements.js";
import { fetchClips } from "./twitch.js";
import { loadClips, saveClips, deleteClips, getSaveNames } from "./clips-persistence.js";
import { ClipsTable } from "./clips-table.js";

let clipsTable;

export const submitDates = () => {
  const startDate = getById("start_date").value + "T00:00:00Z";
  const endDate = getById("end_date").value + "T23:59:59Z";

  fetchClips(startDate, endDate).then((clips) => {
    createClipsTable(clips);
    clipsTable.render();
  });
};

export const addSelectedClips = () => {
  const currentSavedClips = loadClips(getValueById("save-input"));
  const newClips = clipsTable.getSelection();
  const concatClips = {data: currentSavedClips.data.concat(newClips.data)};

  clipsTable.refresh(concatClips);
};

export const saveSelectedClips = () => {
  clipsTable.refresh();
  saveClips(getValueById("save-input"), clipsTable.clips);
  loadSaveList();
};

export const saveClipsForVideo = () => {
  clipsTable.refresh();
  saveClips("video", clipsTable.clips);
  loadSaveList();
};

export const loadSavedClips = () => {
  const clips = loadClips(getValueById("save-input"));
  createClipsTable(clips);
  clipsTable.render();
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

const createClipsTable = (json) => {
  clipsTable = new ClipsTable("clips-list", document.getElementById("clips-list"));
  clipsTable.feed(json);
};
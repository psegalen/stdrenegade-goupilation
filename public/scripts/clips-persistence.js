//***********************//
// Save & Load           //
//***********************//

import { getById, getValueById, addContent } from "./elements.js";
import { createClipsTable, feedClipsTable , renderClipsTable, getSelectedClips } from "./clips-list.js";

export const saveSelectedClips = () => {
  save(getValueById("save-input"));
};

export const loadSavedClips = () => {
  let savedClips = getSavedClips(getValueById("save-input"));
  createClipsTable("clipsTable", savedClips);
  renderClipsTable();
};

export const deleteSavedClips = () => {
  localStorage.removeItem(`save:${getValueById("save-input")}`);
  getById("save-input").value = "";
  loadSaveList();
};

export const video = () => {
  save("video");
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

export const getSavedClips = (name) => {
  const savedClips = localStorage.getItem(`save:${name}`);
  if (savedClips !== null) {
    return JSON.parse(savedClips);
  } else {
    return { data: [] };
  }
};

export const getSaveNames = () => {
  const keys = Object.keys(localStorage);
  const names = [];
  for (let key of keys) {
    if (key.startsWith("save:")) names.push(key.substring(5));
  }
  return names.sort();
};

const save = (name) => {
  const selectedClips = getSelectedClips();
  feedClipsTable(selectedClips);
  renderClipsTable();

  localStorage.setItem(`save:${name}`, JSON.stringify(selectedClips));
  loadSaveList();
};
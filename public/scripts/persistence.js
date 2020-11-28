//***********************//
// Save & Load           //
//***********************//

import { addContent } from "./elements.js";

export const getSaveNames = () => {
  const keys = Object.keys(localStorage);
  const names = [];
  for (let key of keys) {
    if (key.startsWith("save:")) names.push(key.substring(5));
  }
  return names.sort();
};

export const loadSaveList = () => {
  const saveNames = getSaveNames();

  const saveList = document.getElementById("saveList");
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

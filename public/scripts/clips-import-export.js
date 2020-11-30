//***********************//
// Import / Export       //
//***********************//

import { getById, hide, show, isDisplayed } from "./elements.js";
import { loadSaveList } from './clips-list.js';
import { loadClips, getSaveNames } from "./clips-persistence.js";

export const exportAllSaves = () => {
  const saveNames = getSaveNames();

  const allSaves = {};
  for (let name of saveNames) {
    allSaves[name] = loadClips(name);
  }

  getById("import-export-input").value = JSON.stringify(allSaves);
};

export const importAllSaves = (allSaves) => {
  const input = getById("import-export-input");
  const json = input.value;

  allSaves = JSON.parse(json);
  for (let key in allSaves) {
    localStorage.setItem(
      "save:" + key,
      JSON.stringify(allSaves[key])
    );
  }
  loadSaveList();

  input.value = "";
};

export const toggleViews = () => {
  if (isDisplayed(getById("clips-list"))) {
    hide(getById("clips-list"));
    hide(getById("clips-ribbon"));
    show(getById("import-export"));
    show(getById("import-export-ribbon"), "flex");
    getById("import-export-input").value = "";
  } else {
    show(getById("clips-list"));
    show(getById("clips-ribbon"), "flex");
    hide(getById("import-export"));
    hide(getById("import-export-ribbon"));
  }
};
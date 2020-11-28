//***********************//
// Import / Export       //
//***********************//

import { getById, hide, isDisplayed, show } from "./elements.js";
import {
  getSavedClips,
  getSaveNames,
  loadSaveList,
} from "./persistence.js";

export const showHideImportExport = () => {
  if (isDisplayed(getById("clipsList"))) {
    hide(getById("clipsList"));
    hide(getById("clips-ribbon"));
    show(getById("importExport"));
    show(getById("import-export-ribbon"), "flex");
  } else {
    show(getById("clipsList"));
    show(getById("clips-ribbon"), "flex");
    hide(getById("importExport"));
    hide(getById("import-export-ribbon"));
  }
};

export const exportAllSaves = () => {
  const saveNames = getSaveNames();

  const allSaves = {};
  for (let name of saveNames) {
    allSaves[name] = getSavedClips(name);
  }

  getById("importExportInput").value = JSON.stringify(allSaves);
};

export const importAllSaves = (allSaves) => {
  const json = getById("importExportInput").value;
  allSaves = JSON.parse(json);
  for (let key in allSaves) {
    localStorage.setItem(
      "save:" + key,
      JSON.stringify(allSaves[key])
    );
  }
  loadSaveList();
};

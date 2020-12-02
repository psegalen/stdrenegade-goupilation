//***********************//
// Import / Export       //
//***********************//

import { getById, hide, show, isDisplayed } from "./elements.js";
import { loadSaveList } from './clips-list.js';
import { loadClips, getSaveNames } from "./clips-persistence.js";

export const showImport = () => {
  let confirmButton = getById("import-export-confirm");
  confirmButton.innerText = "Import";
  confirmButton.addEventListener("click", importAllSaves);

  let textInput = getById("import-export-input");
  textInput.value = "";

  let cancelButton = getById("import-export-cancel");
  show(cancelButton);

  show(getById("import-export"), "flex");
}

export const showExport = () => {
  let confirmButton = getById("import-export-confirm");
  confirmButton.innerText = "Done";
  confirmButton.addEventListener("click", hideImportExport);

  let cancelButton = getById("import-export-cancel");
  hide(cancelButton);

  exportAllSaves();

  show(getById("import-export"), "flex");
}

export const hideImportExport = () => {
  hide(getById("import-export"));
}

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
//***********************//
// Event hanlders        //
//***********************//

import { initClipsPage, submitDates } from "./clips.js";
import {
  clips,
  createClipsTable,
  getById,
  getSelectionCheckbox,
  getSelectionIndex,
  getValueById,
  hide,
  selectCount,
  setClips,
  setSelectCount,
  show,
} from "./elements.js";
import {
  exportAllSaves,
  importAllSaves,
  showHideImportExport,
} from "./import-export.js";
import { getSavedClips, loadSaveList } from "./persistence.js";
import { getSelectedClips } from "./selection.js";
import { sortClips } from "./sorts.js";

const filterSelectedClips = () => {
  setClips(getSelectedClips());
  createClipsTable();
};

const addSelectedClips = () => {
  clips.data = getSavedClips(getValueById("save-input")).data.concat(
    getSelectedClips().data
  );
  createClipsTable();
};

const setAllClipsSelectionState = (check) => {
  const clipsCount = getById("clipsTable").childElementCount;

  for (let i = 0; i < clipsCount; i++) {
    const currentCheckBox = getSelectionCheckbox(i);
    const currentInput = getSelectionIndex(i);

    if (check) {
      // check if needed
      if (!currentCheckBox.checked) {
        setSelectCount(selectCount + 1);
        currentInput.value = selectCount;
        show(currentInput);
      }
    } else {
      // uncheck if needed
      if (currentCheckBox.checked) {
        setSelectCount(selectCount - 1);
        currentInput.value = "";
        hide(currentInput);
      }
    }

    currentCheckBox.checked = check;
  }
};

const loadSavedClips = () => {
  setClips(getSavedClips(getValueById("save-input")));
  createClipsTable();
};

const saveSelectedClips = () => {
  setClips(getSelectedClips());
  createClipsTable();

  localStorage.setItem(
    `save:${getValueById("save-input")}`,
    JSON.stringify(clips)
  );
  loadSaveList();
};

const deleteSavedClips = () => {
  setClips({ data: [] });
  createClipsTable();
  localStorage.removeItem(`save:${getValueById("save-input")}`);
  getById("save-input").value = "";
  loadSaveList();
};

const goupilation = () => {
  const goupilationClips = getSelectedClips();
  localStorage.setItem(
    "save:goupilation",
    JSON.stringify(goupilationClips)
  );
};

// Create buttons event handlers when page is loaded
window.addEventListener("load", () => {
  getById("filter-selected-button").addEventListener(
    "click",
    filterSelectedClips
  );
  getById("add-selected-button").addEventListener(
    "click",
    addSelectedClips
  );
  getById("select-all-button").addEventListener("click", () =>
    setAllClipsSelectionState(true)
  );
  getById("unselect-all-button").addEventListener("click", () =>
    setAllClipsSelectionState(false)
  );
  getById("save-button").addEventListener("click", saveSelectedClips);
  getById("load-button").addEventListener("click", loadSavedClips);
  getById("delete-button").addEventListener(
    "click",
    deleteSavedClips
  );
  getById("sort-button").addEventListener("click", sortClips);
  getById("toggle-import-export").addEventListener(
    "click",
    showHideImportExport
  );
  getById("export-button").addEventListener("click", exportAllSaves);
  getById("import-button").addEventListener("click", importAllSaves);
  getById("goupilation-button").addEventListener(
    "click",
    goupilation
  );
  getById("submit-dates-button").addEventListener(
    "click",
    submitDates
  );
  initClipsPage();
});

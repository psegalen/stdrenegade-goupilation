//***********************//
// Event hanlders        //
//***********************//

import { getById } from "./elements.js";
import { submitDates, addSelectedClips, saveSelectedClips, loadSavedClips, deleteSavedClips, saveClipsForVideo, loadSaveList } from "./clips-list.js";
import { showExport, showImport, hideImportExport } from "./clips-import-export.js";

// Create buttons event handlers when page is loaded
window.addEventListener("load", () => {
  getById("submit-dates-button").addEventListener("click", submitDates);

  getById("add-selected-button").addEventListener("click", addSelectedClips);

  getById("save-button").addEventListener("click", saveSelectedClips);
  getById("load-button").addEventListener("click", loadSavedClips);
  getById("delete-button").addEventListener("click", deleteSavedClips);

  getById("video-button").addEventListener("click", saveClipsForVideo);

  getById("export-button").addEventListener("click", showExport);
  getById("import-button").addEventListener("click", showImport);
  getById("import-export-cancel").addEventListener("click", hideImportExport);
  loadSaveList();
});
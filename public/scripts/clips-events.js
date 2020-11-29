//***********************//
// Event hanlders        //
//***********************//

import { getById } from "./elements.js";
import { submitDates, selectAllClips, unselectAllClips, filterSelectedClips, addSelectedClips, sortClips } from "./clips-list.js";
import { saveSelectedClips, loadSavedClips, deleteSavedClips, video, loadSaveList} from "./clips-persistence.js";
import { exportAllSaves, importAllSaves, toggleViews } from "./clips-import-export.js";

// Create buttons event handlers when page is loaded
window.addEventListener("load", () => {
  getById("submit-dates-button").addEventListener("click", submitDates);

  getById("select-all-button").addEventListener("click", selectAllClips);
  getById("unselect-all-button").addEventListener("click", unselectAllClips);
  getById("filter-selected-button").addEventListener("click", filterSelectedClips);
  getById("add-selected-button").addEventListener("click", addSelectedClips);

  getById("sort-button").addEventListener("click", sortClips);

  getById("save-button").addEventListener("click", saveSelectedClips);
  getById("load-button").addEventListener("click", loadSavedClips);
  getById("delete-button").addEventListener("click", deleteSavedClips);

  getById("video-button").addEventListener("click", video);

  getById("export-button").addEventListener("click", exportAllSaves);
  getById("import-button").addEventListener("click", importAllSaves);
  
  getById("toggle-views").addEventListener("click", toggleViews);

  loadSaveList();
});
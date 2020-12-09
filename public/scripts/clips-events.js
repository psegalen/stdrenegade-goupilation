//***********************//
// Event hanlders        //
//***********************//

import { getById } from "./elements.js";
import { submitDates, addSelectedClips,
         showSaveDialog, hideSaveDialog, performSelect, performSave,
         showLoadDialog, hideLoadDialog, performLoad,
         showDeleteDialog, hideDeleteDialog, performDelete,
         viewRemoteClips, viewLocalClips, viewVideo
       } from "./clips-editor.js";
import { showExportDialog, showImportDialog, hideImportExportDialog } from "./video-import-export.js";

// Create buttons event handlers when page is loaded
window.addEventListener("load", () => {
  getById("submit-dates-button").addEventListener("click", submitDates);
  getById("add-selected-button").addEventListener("click", addSelectedClips);
  getById("view-local").addEventListener("click", viewLocalClips);

  getById("view-remote").addEventListener("click", viewRemoteClips);
  getById("save-button").addEventListener("click", showSaveDialog);
  getById("save-select").addEventListener("click", performSelect);
  getById("save-confirm").addEventListener("click", performSave);
  getById("save-cancel").addEventListener("click", hideSaveDialog);

  getById("load-button").addEventListener("click", showLoadDialog);
  getById("load-confirm").addEventListener("click", performLoad);
  getById("load-cancel").addEventListener("click", hideLoadDialog);

  getById("delete-button").addEventListener("click", showDeleteDialog);
  getById("delete-confirm").addEventListener("click", performDelete);
  getById("delete-close").addEventListener("click", hideDeleteDialog);
 
  getById("export-button").addEventListener("click", showExportDialog);
  getById("import-button").addEventListener("click", showImportDialog);
  getById("import-export-cancel").addEventListener("click", hideImportExportDialog);

  getById("view-video").addEventListener("click", viewVideo);
});
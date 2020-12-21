//***********************//
// Event hanlders        //
//***********************//

import { getById } from "./elements.js";
import { submitDates, addSelectedClips,
         showSaveDialog, hideSaveDialog, performSelect, performSave,
         showLoadDialog, hideLoadDialog, performLoad,
         showDeleteDialog, hideDeleteDialog, performDelete,
         viewRemoteClips, viewLocalClips, viewVideo, showChooseDialog, performChoose, hideChooseDialog
       } from "./clips-editor.js";
import { showExportDialog, showImportDialog, hideImportExportDialog } from "./video-import-export.js";

let allEventsAdded = false;

const addAllEvents = () => {
  if (!allEventsAdded) {
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

    getById("choose-button").addEventListener("click", showChooseDialog);
    getById("choose-confirm").addEventListener("click", performChoose);
    getById("choose-close").addEventListener("click", hideChooseDialog);
  
    /*
    getById("export-button").addEventListener("click", showExportDialog);
    getById("import-button").addEventListener("click", showImportDialog);
    getById("import-export-cancel").addEventListener("click", hideImportExportDialog);
    */

    getById("view-video").addEventListener("click", viewVideo);

    getById("signout-button").addEventListener("click", () => {
      firebase.auth().signOut();
      getById("sign-in-wall").style.display = "flex";
    });
  }
}

const signInUSer = () => {
  const email = getById("sign-in-email").value;
  const password = getById("sign-in-password").value;
  firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(() => 
        firebase.auth().signInWithEmailAndPassword(email, password)
          .then((user) => {
            console.log("Firebase user:", user);
            if (user) {
              addAllEvents();
              getById("sign-in-wall").style.display = "none";
            }
          })
          .catch((err) => alert(err.message))
      );
}

// Create buttons event handlers when page is loaded
window.addEventListener("load", () => {
  console.log("Firebase user:", firebase.auth().currentUser);
  if (!firebase.auth().currentUser) {
    // Show blocking sign in modal
    getById("sign-in-wall").style.display = "flex";
    getById("sign-in-confirm").addEventListener("click", signInUSer);
    getById("sign-in-password").addEventListener("keypress", (e) => {
      if (e.key.toLocaleLowerCase() === "enter") {
        signInUSer();
      }
    });
  } else {
    addAllEvents();
  }
});
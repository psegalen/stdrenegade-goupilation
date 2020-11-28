//***********************//
// Clips list            //
//***********************//

import { setClips, createClipsTable, getById } from "./elements.js";
import { fetchClips } from "./twitch.js";
import { loadSaveList } from "./persistence.js";
import { sortClipsByDate } from "./sorts.js";

export const initClipsPage = () => {
  loadSaveList();
};

export const submitDates = () => {
  const startDate = getById("start_date").value + "T00:00:00Z";
  const endDate = getById("end_date").value + "T23:59:59Z";

  fetchClips(startDate, endDate).then((json) => {
    setClips(json);
    sortClipsByDate();
    createClipsTable();
  });
};

//***********************//
// Clips list            //
//***********************//

import { getById, getValueById } from "./elements.js";
import { fetchClips } from "./twitch.js";
import { ClipsTable } from "./clips-table.js";
import { getSavedClips } from "./clips-persistence.js";

let clipsTable;

export const submitDates = () => {
  const startDate = getById("start_date").value + "T00:00:00Z";
  const endDate = getById("end_date").value + "T23:59:59Z";

  fetchClips(startDate, endDate).then((json) => {
    createClipsTable("clipsTable", json);
    renderClipsTable();
  });
};

export const addSelectedClips = () => {
  const currentSavedClips = getSavedClips(getValueById("save-input"));
  const newClips = clipsTable.getSelection();
  const concatClips = {data: currentSavedClips.data.concat(newClips.data)};

  clipsTable.feed(concatClips);
  renderClipsTable();
};

export const createClipsTable = (id, json) => {
  clipsTable = new ClipsTable(id);
  clipsTable.feed(json);
};

export const feedClipsTable = (json) => {
  clipsTable.feed(json);
};

export const renderClipsTable = () => {
  clipsTable.render(getById("clips-list"));
};

export const getSelectedClips = () => {
  return clipsTable.getSelection();
};
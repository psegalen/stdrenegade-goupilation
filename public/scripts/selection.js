//***********************//
// Selection             //
//***********************//

import {
  clips,
  getById,
  getSelectionIndex,
  selectCount,
} from "./elements.js";

export const getSelectedClips = () => {
  // initialize object
  const selectedClips = { data: [] };
  for (let i = 0; i < selectCount; i++) {
    selectedClips.data.push(null);
  }

  // store selected clips with valid index
  const clipsCount = getById("clipsTable").childElementCount;
  for (let i = 0; i < clipsCount; i++) {
    let currentInput = getSelectionIndex(i);
    let currentValue = parseInt(currentInput.value);
    if (!isNaN(currentValue) && currentValue <= selectCount) {
      selectedClips.data[currentValue - 1] = clips.data[i];
    }
  }

  // remove null objects
  selectedClips.data = selectedClips.data.filter(function (clip) {
    return clip != null;
  });

  return selectedClips;
};

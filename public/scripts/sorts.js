//***********************//
// Sorts                 //
//***********************//

import { clips, createClipsTable, getValueById } from "./elements.js";

export const sortClipsByDate = () =>
  clips.data.sort((clip1, clip2) => {
    const date1 = clip1.created_at;
    const date2 = clip2.created_at;
    return date2.localeCompare(date1);
  });

const sortClipsByViews = () =>
  clips.data.sort((clip1, clip2) => {
    var views1 = clip1.view_count;
    var views2 = clip2.view_count;
    return views2 - views1;
  });

const sortClipsByTitle = () =>
  clips.data.sort((clip1, clip2) => {
    var title1 = clip1.title;
    var title2 = clip2.title;
    return title1.localeCompare(title2);
  });

const sortClipsByCreator = () =>
  clips.data.sort((clip1, clip2) => {
    var creator1 = clip1.creator_name;
    var creator2 = clip2.creator_name;
    return creator1.localeCompare(creator2);
  });

export const sortClips = () => {
  const opt = getValueById("sortOption");

  switch (opt) {
    case "date":
      sortClipsByDate();
      break;
    case "views":
      sortClipsByViews();
      break;
    case "title":
      sortClipsByTitle();
      break;
    case "creator":
      sortClipsByCreator();
      break;
  }

  createClipsTable();
};

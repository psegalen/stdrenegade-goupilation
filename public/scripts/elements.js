//************************//
// Everything DOM-related //
//************************//

export const CLIP_SELECTED = "clipSelected"; // root id for clip selection checkboxes
export const CLIP_INDEX = "clipIndex"; // root id for clip selection index

export let clips;
export let selectCount = 0;
const elements = {};

export const setClips = (newValue) => (clips = newValue);
export const setSelectCount = (newValue) => (selectCount = newValue);

export const getById = (id) => {
  // If the element corresponding to the id isn't in our object...
  if (typeof elements[id] === "undefined") {
    // ...insert it
    elements[id] = document.getElementById(id);
  }
  return elements[id];
};

export const getValueById = (id) => {
  const element = getById(id);
  return element.value;
};

export const getSelectionIndex = (index) =>
  getById(`${CLIP_INDEX}${index}`);

export const getSelectionCheckbox = (index) =>
  getById(`${CLIP_SELECTED}${index}`);

//***********************//
// Helpers               //
//***********************//

export const addCell = (row) => {
  const cell = addContent(row, "div");
  cell.setAttribute("class", "divTableCell");

  return cell;
};

export const addContent = (container, type) => {
  const content = document.createElement(type);
  container.appendChild(content);

  return content;
};

export const show = (elt, style) => {
  if (style == undefined) style = "block";
  elt.style.display = style;
};

export const hide = (elt) => {
  elt.style.display = "none";
};

export const isDisplayed = (elt) => {
  return elt.style.display != "none";
};

//***********************//
// Clips specifics       //
//***********************//

export const createClipsTable = () => {
  selectCount = 0;

  // create row for each clip
  const rows = [];
  for (let i = 0; i < clips.data.length; i++) {
    selectCount++;

    const clip = clips.data[i];
    let row, cell, content;

    row = document.createElement("div");
    row.setAttribute("class", "divTableRow");
    rows.push(row);

    // checkbox
    cell = addCell(row);

    content = addContent(cell, "input");
    content.setAttribute("type", "checkbox");
    content.setAttribute("id", CLIP_SELECTED + i);
    content.setAttribute("checked", true);
    content.onclick = () => clipSelectionHandler(i);

    // order
    cell = addCell(row);
    cell.style.width = "25px";

    content = addContent(cell, "input");
    content.setAttribute("type", "text");
    content.setAttribute("id", CLIP_INDEX + i);
    content.setAttribute("value", selectCount);
    content.style.width = "20px";

    // thumbnail
    cell = addCell(row);

    content = addContent(cell, "img");
    content.setAttribute("src", clip.thumbnail_url);

    // title
    cell = addCell(row);

    content = addContent(cell, "a");
    content.setAttribute("href", clip.url);
    content.innerHTML = clip.title;

    content = addContent(cell, "div");
    content.setAttribute("class", "annotation");
    content.innerHTML = clip.view_count + " view(s)";

    // creator
    cell = addCell(row);
    cell.innerHTML = clip.creator_name;

    // date
    cell = addCell(row);
    cell.innerHTML = clip.created_at
      .replace("T", " &nbsp;&nbsp;")
      .replace("Z", "");
  }

  // delete current table
  const clipsList = getById("clipsList");
  clipsList.innerHTML = "";

  // create new table
  const table = document.createElement("div");
  table.setAttribute("id", "clipsTable");
  table.setAttribute("class", "divTable");

  // add rows to table
  for (let row of rows) {
    table.appendChild(row);
  }

  clipsList.appendChild(table);
};

const clipSelectionHandler = (index) => {
  const selectedCheckBox = getSelectionCheckbox(index);
  const selectedInput = getSelectionIndex(index);

  if (selectedCheckBox.checked) {
    // show input
    show(selectedInput);
    selectCount++;
    selectedInput.value = selectCount;
  } else {
    let selectedValue = parseInt(selectedInput.value);

    // hide input
    hide(selectedInput);
    selectCount--;
    selectedInput.value = "";

    // update subsequent values
    const clipsCount = getById("clipsTable").childElementCount;
    for (let i = 0; i < clipsCount; i++) {
      let currentInput = getSelectionIndex(i);
      let currentalue = parseInt(currentInput.value);
      if (!isNaN(currentalue) && currentalue > selectedValue) {
        currentInput.value = currentalue - 1;
      }
    }
  }
};

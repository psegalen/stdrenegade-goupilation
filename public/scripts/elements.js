//************************//
// Everything DOM-related //
//************************//

const elements = {};

export const getById = (id) => {
  if (typeof elements[id] === "undefined") {
    elements[id] = document.getElementById(id);
  }
  return elements[id];
};

export const getValueById = (id) => {
  const element = getById(id);
  return element.value;
};

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
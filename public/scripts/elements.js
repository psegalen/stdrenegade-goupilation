//************************//
// Everything DOM-related //
//************************//

export const getById = (id) => {
  return document.getElementById(id);
};

export const getValueById = (id) => {
  return getById(id).value;
};

export const addCell = (row) => {
  const cell = addContent(row, "div");
  cell.setAttribute("class", "divTableCell");

  return cell;
};

export const addContent = (container, type, innerHTML, attributes, callbacks) => {
  const content = document.createElement(type);

  if(innerHTML != undefined && innerHTML != null) {
    content.innerHTML = innerHTML;
  }

  if(attributes != undefined && attributes != null) {
    for(let attribute of attributes) {
      content.setAttribute(attribute.key, attribute.value);
    }
  }

  if(callbacks != undefined && callbacks != null) {
    for(let callback of callbacks) {
      content[callback.event] = callback.callback;
    }
  }

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
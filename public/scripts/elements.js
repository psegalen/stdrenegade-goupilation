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

export const createCombo = (parent, id, options) => {
  let combo = document.createElement("select");
  combo.setAttribute("id", id);

  for(let option of options) {
    let entry = document.createElement("option");
    entry.setAttribute("value", option.value);
    entry.innerHTML = option.caption;
    combo.appendChild(entry);
  }

  parent.appendChild(combo);

  return combo;
}
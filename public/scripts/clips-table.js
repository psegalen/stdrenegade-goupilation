import {show, hide, addContent, addCell} from "./elements.js";

export class ClipsTable {
    constructor(id) {
        this.id = id;
    }

    // set the clips for the table
    feed(json) {
		this.clips = json;
		this.selection = new Array(json.data.length);
		this.order = new Array(json.data.length);

		for(let i=0; i<json.data.length; i++) {
			this.selection[i] = true;
			this.order[i] = i+1;
		}
    }

    // get the selected elements in the indicated order
	getSelection() {
		let dataCount = this.clips.data.length;

		// initialize object
		let selectedClips = {data:[]};
		for(let i=0; i<dataCount; i++) {
			selectedClips.data.push(null);
		}
		
		// store selected elements with valid index
		for(let i=0; i<dataCount; i++) {
			let currentSelection = this.selection[i];
			let currentOrder = this.order[i];
			let isSelected = currentSelection == true;
			let isIndexValid =  !isNaN(currentOrder) && currentOrder <= dataCount;
			if(isSelected && isIndexValid) {
				selectedClips.data[currentOrder] = this.clips.data[i];
			}
		}
		
		// remove null objects
		selectedClips.data = selectedClips.data.filter((clip) => {
			return clip != null;
		});
		
		return selectedClips;		
	}

    // select/unselect the clips and update the UI
	selectAll(state) {
		for(let i=0; i<this.clips.data.length; i++) {
            let selectionCheckbox = document.getElementById(`${this.id}Selection${i}`);
            let orderInput = document.getElementById(`${this.id}Order${i}`);

            // selection
            this.selection[i] = state;
            selectionCheckbox.checked = state;

            // order
            if(state == true) {
                this.order[i] = i+1;
                orderInput.value = this.order[i];
                show(orderInput);
            } else {
                this.order[i] = null;
                orderInput.value = "";
                hide(orderInput);
            }
		}
	}

    // sort the clips and update the UI
	sort(property, order) {
		this.clips.data.sort((data1, data2) => {
			let value1 = data1[property];
            let value2 = data2[property];
			switch(order) {
				case "asc":
					if(isNaN(value1)) {
						return value1.localeCompare(value2);
					} else {
						return value1 - value2;
					}
					break;
				case "desc":
					if(isNaN(value1)) {
						return value2.localeCompare(value1);
					} else {
						return value2 - value1;
					}
					break;
				default:
					return 0;
			}
        });

        this.render(document.getElementById(`${this.id}Table`).parentElement);
	}

    // display the table
	render(parent) {
		let clips = this.clips.data;

		let rows = [];
		for(let i=0; i<clips.length; i++) {			
			let clip = clips[i];
			let row, cell, content;
			
			row = document.createElement("div");
			row.setAttribute("class", "divTableRow");
			rows.push(row);
			
			// checkbox
			cell = addCell(row);
			
			content = addContent(cell, "input");
			content.setAttribute("id", `${this.id}Selection${i}`);
			content.setAttribute("type", "checkbox");
			content.setAttribute("checked", this.selection[i]);
			content.onclick = function() {
				this.selectionChangedHandler(this.id, i);
			}.bind(this);

			// order
			cell = addCell(row);
			cell.style.width = "25px";
			
			content = addContent(cell, "input");
			content.setAttribute("id", `${this.id}Order${i}`);
			content.setAttribute("type", "text");
			content.setAttribute("value", i+1);
			content.style.width = "20px";
			content.oninput = function() {
				this.orderChangedHandler(this.id, i);
			}.bind(this);
			
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
			cell.innerHTML = clip.created_at.replace("T", " &nbsp;&nbsp;").replace("Z", "");
		}
		
		// create new table
		let table = document.createElement("div");
        table.setAttribute("class", "divTable");
        table.setAttribute("id", `${this.id}Table`);
		
		// add rows to table
		for(let row of rows) {
			table.appendChild(row);
		}
		
		parent.innerHTML = "";
		parent.appendChild(table);
	}

    // handle checkbox click
	selectionChangedHandler(id, index) {
		let selectionCheckbox = document.getElementById(`${id}Selection${index}`);
		let orderInput = document.getElementById(`${id}Order${index}`);

		this.selection[index] = selectionCheckbox.checked;

		if(selectionCheckbox.checked) {
			// show input
			this.order[index] = Math.max(...this.order) + 1;
			orderInput.value = this.order[index];
			show(orderInput);
				
		} else {
			let order = parseInt(orderInput.value);
			
            // hide input
            this.order[index] = "";
			orderInput.value = this.order[index];
			hide(orderInput);
			
			// update subsequent values
			for(let i=0; i<this.clips.data.length; i++) {
				let currentOrderInput = document.getElementById(`${id}Order${i}`);
				let currentOrderValue = parseInt(currentOrderInput.value);
				if(!isNaN(currentOrderValue) && currentOrderValue > order) {
                    this.order[i]--;
					currentOrderInput.value--;
				}
			}
		}
	}

    // handle order field value change
	orderChangedHandler(id, index) {
		let orderInput = document.getElementById(`${id}Order${index}`);
        this.order[index] = orderInput.value;
	}
}
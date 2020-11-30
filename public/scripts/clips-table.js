import {show, hide, getById, getValueById, addContent, addCell, createCombo} from "./elements.js";

export class ClipsTable {
    constructor(id, parent) {
		this.id = id;
		this.parent = parent;
    }

    // set the clips for the table
    feed(clips) {
		this.clips = clips;
		this.selection = new Array(clips.data.length);
		this.order = new Array(clips.data.length);

		for(let i=0; i<clips.data.length; i++) {
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

	// render the table with the current selection or the provided clips
	refresh(clips) {
		this.feed(clips == undefined ? this.getSelection() : clips);
		this.render();
	}

    // select/unselect the clips and update the UI
	selectAll(state) {
		for(let i=0; i<this.clips.data.length; i++) {
            let selectionCheckbox = getById(`${this.id}Selection${i}`);
            let orderInput = getById(`${this.id}Order${i}`);

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
		// sort clips
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
		
		// reset selection and order
		for(let i=0; i<this.clips.data.length; i++) {
			this.selection[i] = true;
			this.order[i] = i+1;
		}

        this.render();
	}

    // display the table
	render() {
		let clips = this.clips.data;
		let rows = [];

		// caption row
		if(clips.length > 0) {
			rows.push(this.getCaptionRow());
		}

		// clip rows
		for(let i=0; i<clips.length; i++) {
			rows.push(this.getClipRow(i));
		}
		
		// create new table
		this.parent.innerHTML = "";
		let table = addContent(this.parent, "div", null, [{key:"class", value:"divTable"}, {key:"id", value:`${this.id}Table`}])

		// add rows to table
		for(let row of rows) {
			table.appendChild(row);
		}
	}

	getCaptionRow() {
		let row = document.createElement("div");
		row.setAttribute("class", "divTableCaption");
		
		// select all
		addContent(row, "button", "&#9745;",
			[{key:"class", value:"headerButton"}, {key:"title", value:"Select all"}],
			[{event:"onclick", callback:function() {this.selectAll(true);}.bind(this)}]
		);

		// unselect all
		addContent(row, "button", "&#9744;",
			[{key:"class", value:"headerButton"}, {key:"title", value:"Unselect all"}],
			[{event:"onclick", callback:function() {this.selectAll(false)}.bind(this)}]
		);

		// filter
		addContent(row, "button", "&#10227;",
			[{key:"class", value:"headerButton"}, {key:"title", value:"Show only selection"}],
			[{event:"onclick", callback:function() {this.refresh();}.bind(this)}]
		);

		// sort options
		createCombo(row, `${this.id}SortOption`, [
			{value:"created_at", caption:"Date created"},
			{value:"view_count", caption:"View Count"},
			{value:"title", caption:"Title"},
			{value:"creator_name", caption:"Creator name"}
		]).style.margin = "0px 3px 0px 20px";

		// sort buttons
		addContent(row, "button", "&#8593;",
			[{key:"class", value:"headerButton"}, {key:"title", value:"Sort ascending"}],
			[{event:"onclick", callback:function() {const sortValue = getValueById(`${this.id}SortOption`); this.sort(sortValue, "asc");}.bind(this)}]
		);

		addContent(row, "button", "&#8595;",
			[{key:"class", value:"headerButton"}, {key:"title", value:"Sort descending"}],
			[{event:"onclick", callback:function() {const sortValue = getValueById(`${this.id}SortOption`); this.sort(sortValue, "desc");}.bind(this)}]
		);

		return row;
	}

	getClipRow(i) {
		let row, cell;
		let clip = this.clips.data[i];
			
		row = document.createElement("div");
		row.setAttribute("class", "divTableRow");
		
		// checkbox
		cell = addCell(row);
		addContent(cell, "input", null,
			[{key:"id", value:`${this.id}Selection${i}`}, {key:"type", value: "checkbox"}, {key:"checked", value:this.selection[i]}],
			[{event:"onclick", callback:function() {this.selectionChangedHandler(this.id, i);}.bind(this)}]
		);

		// order
		cell = addCell(row);
		cell.style.width = "25px";		
		addContent(cell, "input", null,
			[{key:"id", value:`${this.id}Order${i}`}, {key:"type", value: "text"}, {key:"value", value:i+1}, {key:"style", value:"width: 20px"}],
			[{event:"oninput", callback:function() {this.orderChangedHandler(this.id, i);}.bind(this)}]
		);
				
		// thumbnail
		cell = addCell(row);
		addContent(cell, "img", null, [{key:"src", value:clip.thumbnail_url}]);
		
		// title
		cell = addCell(row);		
		addContent(cell, "a", clip.title, [{key:"href", value:clip.url}, {key:"target", value:"blank"}]);	
		addContent(cell, "div", clip.view_count + " view(s)",[{key:"class", value:"annotation"}]);
		
		// creator
		cell = addCell(row);
		cell.innerHTML = clip.creator_name;
		
		// date
		cell = addCell(row);		
		cell.innerHTML = clip.created_at.replace("T", " &nbsp;&nbsp;").replace("Z", "");

		return row;
	}

    // handle checkbox click
	selectionChangedHandler(id, index) {
		let selectionCheckbox = getById(`${id}Selection${index}`);
		let orderInput = getById(`${id}Order${index}`);

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
				let currentOrderInput = getById(`${id}Order${i}`);
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
		let orderInput = getById(`${id}Order${index}`);
        this.order[index] = orderInput.value;
	}
}
import {show, hide, addContent, addCell, createCombo} from "./elements.js";

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

		let row, cell;
		let rows = [];

		// caption row
		if(clips.length > 0) {
			row = document.createElement("div");
			row.setAttribute("class", "divTableCaption");
			
			// select all
			addContent(row, "button", "&#9745;",
				[{key:"class", value:"headerButton"}],
				[{event:"onclick", callback:function() {this.selectAll(true);}.bind(this)}]
			);
	
			// unselect all
			addContent(row, "button", "&#9744;",
				[{key:"class", value:"headerButton"}],
				[{event:"onclick", callback:function() {this.selectAll(false)}.bind(this)}]
			);

			// filter
			addContent(row, "button", "&#10227;",
				[{key:"class", value:"headerButton"}],
				[{event:"onclick", callback:function() {this.feed(this.getSelection()); this.render(parent);}.bind(this)}]
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
				[{key:"class", value:"headerButton"}],
				[{event:"onclick", callback:function() {const sortValue = document.getElementById(`${this.id}SortOption`).value; this.sort(sortValue, "asc");}.bind(this)}]
			);

			addContent(row, "button", "&#8595;",
				[{key:"class", value:"headerButton"}],
				[{event:"onclick", callback:function() {const sortValue = document.getElementById(`${this.id}SortOption`).value; this.sort(sortValue, "desc");}.bind(this)}]
			);
	
			rows.push(row);
		}

		for(let i=0; i<clips.length; i++) {			
			let clip = clips[i];
			
			row = document.createElement("div");
			row.setAttribute("class", "divTableRow");
			rows.push(row);
			
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
			addContent(cell, "a", clip.title, [{key:"href", value:clip.url}]);	
			addContent(cell, "div", clip.view_count + " view(s)",[{key:"class", value:"annotation"}]);
			
			// creator
			cell = addCell(row);
			cell.innerHTML = clip.creator_name;
			
			// date
			cell = addCell(row);		
			cell.innerHTML = clip.created_at.replace("T", " &nbsp;&nbsp;").replace("Z", "");
		}
		
		// create new table
		parent.innerHTML = "";
		let table = addContent(parent, "div", null, [{key:"class", value:"divTable"}, {key:"id", value:`${this.id}Table`}])

		// add rows to table
		for(let row of rows) {
			table.appendChild(row);
		}
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
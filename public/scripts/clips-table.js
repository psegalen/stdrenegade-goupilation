import {show, hide, getById, getValueById, addContent} from "./elements.js";

export class ClipsTable {
    constructor(id, parent) {
		this.id = id;
		this.parent = parent;
		this.clips = [];
		this.selection = [];
		this.order = [];
    }

    // set the clips for the table
    feed(clips) {
		this.clips = clips;
		this.selection = new Array(clips.length);
		this.order = new Array(clips.length);

		for(let i=0; i<clips.length; i++) {
			this.selection[i] = true;
			this.order[i] = i+1;
		}
    }

    // get the selected elements in the indicated order
	getSelection() {
		let dataCount = this.clips.length;

		// initialize object
		let selectedClips = [];
		for(let i=0; i<dataCount; i++) {
			selectedClips.push(null);
		}
		
		// store selected elements with valid index
		for(let i=0; i<dataCount; i++) {
			let currentSelection = this.selection[i];
			let currentOrder = this.order[i];
			let isSelected = currentSelection == true;
			let isIndexValid =  !isNaN(currentOrder) && currentOrder <= dataCount;
			if(isSelected && isIndexValid) {
				selectedClips[currentOrder] = this.clips[i];
			}
		}
		
		// remove null objects
		selectedClips = selectedClips.filter((clip) => {
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
		for(let i=0; i<this.clips.length; i++) {
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
		this.clips.sort((data1, data2) => {
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
		for(let i=0; i<this.clips.length; i++) {
			this.selection[i] = true;
			this.order[i] = i+1;
		}

        this.render();
	}

    // display the table
	render() {
		let clips = this.clips;
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
		let row = getById(`${this.id}Caption`);
		if(row) return row;

		// row html
		const template =
			`<div id="${this.id}Caption" class="divTableCaption">
				<div class="horizontal">
					<button id="${this.id}SelectAll" class="headerButton" title="Select all">&#9745;</button>
					<button id="${this.id}UnselectAll" class="headerButton" title="Unselect all">&#9744;</button>
					<button id="${this.id}ShowOnlySelection" class="headerButton" title="Show only selection">&#10227;</button>
					<select id="${this.id}SortOption" style="margin:0px 3px 0px 20px">
						<option value="created_at">Date created</option>
						<option value="view_count">View Count</option>
						<option value="title">Title</option>
						<option value="creator_name">Creator name</option>
					</select>
					<button id="${this.id}SortAscending" class="headerButton" title="Sort ascending">&#8593;</button>
					<button id="${this.id}SortDescending" class="headerButton" title="Sort descending">&#8595;</button>
				</div>
			</div>`

		row = document.createElement("div");
		row.setAttribute("class", "divTableCaption");
		row.innerHTML = template;

		// row events
		const selectAllHandler = () => this.selectAll(true);
		const unselectAllHadler = () => this.selectAll(false);
		const showOnlySelectionHandler = () => this.refresh();
		const sortAscendingHadler = () => {const sortValue = getValueById(`${this.id}SortOption`); this.sort(sortValue, "asc")};
		const sortDescendingHadler = () => {const sortValue = getValueById(`${this.id}SortOption`); this.sort(sortValue, "desc")};

		row.querySelector(`#${this.id}SelectAll`).addEventListener("click", selectAllHandler);
		row.querySelector(`#${this.id}UnselectAll`).addEventListener("click", unselectAllHadler);
		row.querySelector(`#${this.id}ShowOnlySelection`).addEventListener("click", showOnlySelectionHandler);
		row.querySelector(`#${this.id}SortAscending`).addEventListener("click", sortAscendingHadler);
		row.querySelector(`#${this.id}SortDescending`).addEventListener("click", sortDescendingHadler);

		return row;
	}

	getClipRow(i) {
		let row;
		let clip = this.clips[i];

		// row html
		const template = 
			`<div class="divTableCell">
				<input id="${this.id}Selection${i}" type="checkbox" checked="${this.selection[i]}" />
			</div>
			<div class="divTableCell" style="width: 25px;">
				<input id="${this.id}Order${i}" type="text" value="${i + 1}" style="width: 20px" />
			</div>
			<div class="divTableCell">
				<img src="${clip.thumbnail_url}" />
			</div>
			<div class="divTableCell">
				<div id=${this.id}Embed${i} class="embed-link" title="Preview clip">${clip.title}</div>
				<div class="annotation">${clip.view_count} view(s)</div>
			</div>
			<div class="divTableCell">${clip.creator_name}</div>
			<div class="divTableCell">${clip.created_at.replace("T", " &nbsp;&nbsp;").replace("Z", "")}</div>`;
			
		row = document.createElement("div");
		row.setAttribute("id", `${this.id}Row${i}`);
		row.setAttribute("class", "divTableRow");
		row.innerHTML = template;

		// row events
		const embedClickHandler = () => {
			// highlight row
			let highlightedRow = document.querySelector(".highlightedRow");
			if(highlightedRow) highlightedRow.classList.remove("highlightedRow");
			getById(`${this.id}Row${i}`).classList.add("highlightedRow");

			// display embed
			let viewerContainer = getById("viewer-container");
			viewerContainer.src = `${clip.embed_url}&parent=${location.hostname}&autoplay=true&muted=false`;
			show(viewerContainer);
		};

		row.querySelector(`#${this.id}Embed${i}`).addEventListener("click", embedClickHandler);
		row.querySelector(`#${this.id}Selection${i}`).addEventListener("click", () => this.selectionChangedHandler(this.id, i));
		row.querySelector(`#${this.id}Order${i}`).addEventListener("input", () => this.orderChangedHandler(this.id, i));
		
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
			for(let i=0; i<this.clips.length; i++) {
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
let clips;

let videoPlayer1, videoPlayer2;
let videoSource1, videoSource2;
let videoOverlay;

let videoIndex;
let selectCount;

let authToken = "";

const BROADCASTER_ID = '89285457'; // StudioRenegade
const CLIENT_ID = "rssu2h41e352q0x8qmu8m9m7c1ymaw";


//***********************//
// Video loop            //
//***********************//

function initVideoPlayers() {
	
	clips = getSavedClips('goupilation');

	if(clips.data.length > 0) {			
		// init members
		videoOverlay = document.getElementById('overlay');
		videoPlayer1 = document.getElementById('player1');
		videoPlayer2 = document.getElementById('player2');
		videoIndex = 0;
		
		// create video sources
		videoSource1 = addVideoSource(videoPlayer1, 'https://firebasestorage.googleapis.com/v0/b/goupilation.appspot.com/o/media%2Fgenerique.mp4?alt=media&token=94374b9a-27fc-43a8-ac5f-6f3b252f0771');		
		videoSource2 = addVideoSource(videoPlayer2, 'https://firebasestorage.googleapis.com/v0/b/goupilation.appspot.com/o/media%2Ftransition.mp4?alt=media&token=cee192d9-0897-408a-b5ca-03d8e410f498');
			
		// set event handlers
		videoPlayer1.addEventListener('ended', clipEndedHandler);
		videoPlayer2.addEventListener('ended', transitionEndedHandler);
		
		// load videos
		videoPlayer1.load();
		videoPlayer2.load();
		
		// set play event
		document.onkeydown = function() {
			show(videoPlayer1);
			videoPlayer1.play();
			document.onkeydown = null;
		}
	} else {
		alert('Select clips using clips.html first');
	}
}

function addVideoSource(videoPlayer, source) {
	var videoSource = document.createElement('source');
	videoSource.setAttribute('type', 'video/mp4');
	videoSource.src = source;
	
	videoPlayer.appendChild(videoSource);
	
	return videoSource;
}

function clipEndedHandler() {
	// start transition
	show(videoPlayer2);
	hide(videoPlayer1);
	hide(videoOverlay);
	
	videoPlayer2.play();
	
	// load next clip/video
	if(videoIndex < clips.data.length) {
		nextClip(videoSource1);
	} else {
		videoSource1.src = 'https://firebasestorage.googleapis.com/v0/b/goupilation.appspot.com/o/media%2Fgenerique.mp4?alt=media&token=94374b9a-27fc-43a8-ac5f-6f3b252f0771';
		videoPlayer1.removeEventListener('ended', clipEndedHandler);
	}
	videoPlayer1.load();
}

function transitionEndedHandler() {
	// start next clip/video
	show(videoPlayer1);
	hide(videoPlayer2);
	
	if(isClipURL(videoSource1.src)) {
		show(videoOverlay);
	} else {
		hide(videoOverlay);
	}
	
	videoPlayer1.play();
}

function nextClip(videoSource) {
	var clip = clips.data[videoIndex];
	videoSource.src = getClipVideoURL(clip);
	videoOverlay.innerHTML = clip.title + ' - Clipped by ' + clip.creator_name;
	videoIndex++;
}

function getClipVideoURL(clip) {
	var index = clip.thumbnail_url.indexOf('-preview-');
	return clip.thumbnail_url.substring(0, index) + '.mp4';
}

function isClipURL(url) {
	return url.startsWith('https://clips');
}


//***********************//
// Twitch API calls      //
//***********************//

function getToken() {
	if (authToken.length === 0) {
		return fetch("https://id.twitch.tv/oauth2/token?client_id=rssu2h41e352q0x8qmu8m9m7c1ymaw&client_secret=0xjzyddhbn30w0jjqliqen3kjsrn36&grant_type=client_credentials"
		, { method: "POST"})
			.then((response) => response.json())
			.then((data) => data.access_token)
	} else {
		return Promise.resolve(authToken);
	}
}

function fetchClips(broadcasterId, startDate, endDate) {
	return getToken().then((token) => {
		authToken = token;

		var url = 'https://api.twitch.tv/helix/clips' + '?broadcaster_id=' + broadcasterId + '&started_at=' + startDate + '&ended_at=' + endDate + '&first=100';
		
		var request = new Request(url, {
			method: 'GET',
			headers: new Headers({
				'Client-ID': CLIENT_ID,
				'Authorization': `Bearer ${authToken}`
			})
		});
		
		return fetch(request).then(function(response) {
			return response.json();
		});
	});
}


//***********************//
// UI elements           //
//***********************//

var UI = {
	
	CLIP_SELECTED: 'clipSelected', // root id for clip selection checkboxes
	CLIP_INDEX: 'clipIndex', // root id for clip selection index
	
	getClipsRibbon: function() {
		return document.getElementById('clips-ribbon');
	},

	getImportExportRibbon: function() {
		return document.getElementById('import-export-ribbon');
	},

	getStartDate: function() {
		return document.getElementById('start_date');
	},

	getEndDate: function() {
		return document.getElementById('end_date');
	},

	getClipsList: function() {
		return document.getElementById('clipsList');
	},

	getImportExport: function() {
		return document.getElementById('importExport');
	},

	getImportExportInput: function() {
		return document.getElementById('importExportInput');
	},

	getSaveList: function() {
		return document.getElementById('saveList');
	},

	getSaveName: function() {
		return document.getElementsByName('saveName')[0];
	},

	getSaveNameValue: function() {
		return this.getSaveName().value;
	},

	getClipsTable: function() {
		return document.getElementById('clipsTable');
	},

	getClipsCount: function() {
		return this.getClipsTable().childElementCount;
	},

	getSortOptionValue: function() {
		return document.getElementById('sortOption').value;
	},
	
	getSelectionCheckbox: function(index) {
		return document.getElementById(this.CLIP_SELECTED + index);
	},
	
	getSelectionIndex: function(index) {
		return document.getElementById(this.CLIP_INDEX + index);
	}
};


//***********************//
// Save & Load           //
//***********************//

function getSaveNames() {
	var keys = Object.keys(localStorage);
	var names = [];
	for (let key of keys) {
		if(key.startsWith('save:')) names.push(key.substring(5));
	}
	return names.sort();
}

function loadSaveList() {
	var saveNames = getSaveNames();
	
	var saveList = UI.getSaveList();
	saveList.innerHTML = '';
	
	for(let name of saveNames) {
		let opt = addContent(saveList, 'option');
		opt.setAttribute('value', name);
	}
}

function getSavedClips(name) {
	var savedClips = localStorage.getItem('save:' + name);
	if(savedClips != null) {
		return JSON.parse(savedClips);
	} else {
		return {data:[]};
	}
}

function loadSavedClips() {
	clips = getSavedClips(UI.getSaveNameValue());
	createClipsTable();
}

function saveSelectedClips() {
	clips = getSelectedClips();
	createClipsTable();
	
	localStorage.setItem('save:' + UI.getSaveNameValue(), JSON.stringify(clips));
	loadSaveList();
}

function deleteSavedClips() {
	clips = {data:[]};
	createClipsTable();
	localStorage.removeItem('save:' + UI.getSaveNameValue());
	UI.getSaveName().value = '';
	loadSaveList();
}

function goupilation() {
	var goupilationClips = getSelectedClips();
	localStorage.setItem('save:goupilation', JSON.stringify(goupilationClips));
}


//***********************//
// Import / Export       //
//***********************//

function showHideImportExport() {
	if(isDisplayed(UI.getClipsList())) {
		hide(UI.getClipsList());
		hide(UI.getClipsRibbon());
		show(UI.getImportExport());
		show(UI.getImportExportRibbon(), 'flex');
	} else {
		show(UI.getClipsList());
		show(UI.getClipsRibbon(), 'flex');
		hide(UI.getImportExport());
		hide(UI.getImportExportRibbon());
	}
}

function exportAllSaves() {
	var saveNames = getSaveNames();
	
	var allSaves = {};
	for(let name of saveNames) {
		let save = {};
		allSaves[name] = getSavedClips(name);
	}
	allSaves = JSON.stringify(allSaves);

	UI.getImportExportInput().value = allSaves;
}

function importAllSaves(allSaves) {
	var json = UI.getImportExportInput().value;
	allSaves = JSON.parse(json);
	for(let key in allSaves) {
		localStorage.setItem('save:' + key, JSON.stringify(allSaves[key]));
	}
	loadSaveList();
}


//***********************//
// Selection             //
//***********************//

function getSelectedClips() {
	// initialize object
	var selectedClips = {data:[]};
	for(let i=0; i<selectCount; i++) {
		selectedClips.data.push(null);
	}
	
	// store selected clips with valid index
	var clipsCount = UI.getClipsCount();
	for(let i=0; i<clipsCount; i++) {
		let currentInput = UI.getSelectionIndex(i);
		let currentValue = parseInt(currentInput.value);
		if(!isNaN(currentValue) && currentValue <= selectCount) {
			selectedClips.data[currentValue-1] = clips.data[i];
		}
	}
	
	// remove null objects
	selectedClips.data = selectedClips.data.filter(function(clip) {
		return clip != null;
	});
	
	return selectedClips;
}

function filterSelectedClips() {
	clips = getSelectedClips();
	createClipsTable();
}

function addSelectedClips() {
	clips.data = getSavedClips(UI.getSaveNameValue()).data.concat(getSelectedClips().data);
	createClipsTable();
}


//***********************//
// Clips list            //
//***********************//

function initClipsPage() {
	loadSaveList();
}

function submitDates() {
	var startDate = UI.getStartDate().value + 'T00:00:00Z';
	var endDate = UI.getEndDate().value + 'T23:59:59Z';
	
	fetchClips(BROADCASTER_ID, startDate, endDate).then(function(json) {
		clips = json;
		sortClipsByDate();
		createClipsTable();
	});
}

function setAllClipsSelectionState(check) {
	var clipsCount = UI.getClipsCount();
	
	for(let i=0; i<clipsCount; i++) {
		let currentCheckBox = UI.getSelectionCheckbox(i);
		let currentInput = UI.getSelectionIndex(i);
		
		if(check) {
			// check if needed
			if(!currentCheckBox.checked) {
				selectCount++;
				currentInput.value = selectCount;
				show(currentInput);
			}
		} else {
			// uncheck if needed
			if(currentCheckBox.checked) {
				selectCount--;
				currentInput.value = '';
				hide(currentInput);
			}
		}
		
		currentCheckBox.checked = check;
	}	
}

function createClipsTable() {
	selectCount = 0;
		
	// create row for each clip
	var rows = [];
	for(let i=0; i<clips.data.length; i++) {
		selectCount++;
		
		let clip = clips.data[i];
		let row, cell, content;
		
		row = document.createElement('div');
		row.setAttribute('class', 'divTableRow');
		rows.push(row);
		
		// checkbox
		cell = addCell(row);
		
		content = addContent(cell, 'input');
		content.setAttribute('type', 'checkbox');
		content.setAttribute('id', UI.CLIP_SELECTED + i);
		content.setAttribute('checked', true);
		content.onclick = function() {
			clipSelectionHandler(i);
		}
		
		// order
		cell = addCell(row);
		cell.style.width = '25px';
		
		content = addContent(cell, 'input');
		content.setAttribute('type', 'text');
		content.setAttribute('id', UI.CLIP_INDEX + i);
		content.setAttribute('value', selectCount);
		content.style.width = '20px';
		
		// thumbnail
		cell = addCell(row);
		
		content = addContent(cell, 'img');
		content.setAttribute('src', clip.thumbnail_url);
		
		// title
		cell = addCell(row);
		
		content = addContent(cell, 'a');
		content.setAttribute('href', clip.url);
		content.innerHTML = clip.title;
		
		content = addContent(cell, 'div');
		content.setAttribute('class', 'annotation');
		content.innerHTML = clip.view_count + ' view(s)';
		
		// creator
		cell = addCell(row);
		cell.innerHTML = clip.creator_name;
		
		// date
		cell = addCell(row);		
		cell.innerHTML = clip.created_at.replace('T', ' &nbsp;&nbsp;').replace('Z', '');
	}
		
	// delete current table
	var clipsList = UI.getClipsList();
	clipsList.innerHTML = "";
	
	// create new table
	var table = document.createElement('div');
	table.setAttribute('id', 'clipsTable');
	table.setAttribute('class', 'divTable');
	
	// add rows to table
	for(let row of rows) {
		table.appendChild(row);
	}
	
	clipsList.appendChild(table);
}

function clipSelectionHandler(index) {
	let selectedCheckBox = UI.getSelectionCheckbox(index);
	let selectedInput = UI.getSelectionIndex(index);
	
	if(selectedCheckBox.checked) {
		// show input
		show(selectedInput);
		selectCount++;
		selectedInput.value = selectCount;
			
	} else {
		let selectedValue = parseInt(selectedInput.value);
		
		// hide input
		hide(selectedInput);
		selectCount--;
		selectedInput.value = '';
		
		// update subsequent values
		let clipsCount = UI.getClipsCount();
		for(let i=0; i<clipsCount; i++) {
			let currentInput = UI.getSelectionIndex(i);
			let currentalue = parseInt(currentInput.value);
			if(!isNaN(currentalue) && currentalue > selectedValue) {
				currentInput.value = currentalue - 1;
			}
		}
	}
}


//***********************//
// Sorts                 //
//***********************//

function sortClipsByDate() {
	clips.data.sort(function(clip1, clip2) {
		var date1 = clip1.created_at;
		var date2 = clip2.created_at;
		return date2.localeCompare(date1);
	});	
}

function sortClipsByViews() {
	clips.data.sort(function(clip1, clip2) {
		var views1 = clip1.view_count;
		var views2 = clip2.view_count;
		return views2 - views1;
	});	
}

function sortClipsByTitle() {
	clips.data.sort(function(clip1, clip2) {
		var title1 = clip1.title;
		var title2 = clip2.title;
		return title1.localeCompare(title2);
	});	
}

function sortClipsByCreator() {
	clips.data.sort(function(clip1, clip2) {
		var creator1 = clip1.creator_name;
		var creator2 = clip2.creator_name;
		return creator1.localeCompare(creator2);
	});	
}

function sortClips() {
	var opt = UI.getSortOptionValue();
	
	switch(opt) {
		case 'date': sortClipsByDate(); break;
		case 'views': sortClipsByViews(); break;
		case 'title': sortClipsByTitle(); break;
		case 'creator': sortClipsByCreator(); break;
	}
	
	createClipsTable();
}


//***********************//
// Helpers               //
//***********************//

function addCell(row) {
	var cell = addContent(row, 'div');
	cell.setAttribute('class', 'divTableCell');
	
	return cell;
}

function addContent(container, type) {
	var content = document.createElement(type);
	container.appendChild(content);
	
	return content;
}

function show(elt, style) {
	if(style == undefined) style = 'block';
	elt.style.display = style;
}

function hide(elt) {
	elt.style.display = 'none';
}

function isDisplayed(elt) {
	return elt.style.display != 'none';
}
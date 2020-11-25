var clips;

var videoPlayer1, videoPlayer2;
var videoSource1, videoSource2;
var videoOverlay;

var videoIndex;
var selectCount;

const BROADCASTER_ID = '89285457'; // StudioRenegade

const CLIP_SELECTED = 'clipSelected'; // root id for clip selection checkboxes
const CLIP_INDEX = 'clipIndex'; // root id for clip selection index


//***********************//
// Twitch API calls      //
//***********************//

function fetchClips(broadcasterId, startDate, endDate) {
	var url = 'https://api.twitch.tv/helix/clips' + '?broadcaster_id=' + broadcasterId + '&started_at=' + startDate + '&ended_at=' + endDate + '&first=100';
	
	var request = new Request(url, {
		method: 'GET',
		headers: new Headers({
			'Client-ID': CLIENT_ID,
			'Authorization': AUTHORIZATION
		})
	});
	
	return fetch(request).then(function(response) {
		return response.json();
	});
}


//***********************//
// Clips list handling   //
//***********************//

function getClipsCount() {
	return document.getElementById('clipsTable').childElementCount;
}

function getSelectedClips() {
	// initialize object
	var selectedClips = {data:[]};
	for(let i=0; i<selectCount; i++) {
		selectedClips.data.push(null);
	}
	
	// store selected clips with valid index
	var clipsCount = getClipsCount();
	for(let i=0; i<clipsCount; i++) {
		let currentInput = document.getElementById(CLIP_INDEX + i);
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

function getSavedClips() {
	var savedClips = localStorage.getItem('savedClips');
	if(savedClips != null) {
		return JSON.parse(savedClips);
	} else {
		return {data:[]};
	}
}

function loadSavedClips() {
	clips = getSavedClips()
	createClipsTable();
}

function filterSelectedClips() {
	clips = getSelectedClips();
	createClipsTable();
}

function addSelectedClips() {
	clips.data = getSavedClips().data.concat(getSelectedClips().data);
	createClipsTable();
	save();
}

function saveSelectedClips() {
	clips = getSelectedClips();
	createClipsTable();
	save();
}

function save() {
	localStorage.removeItem('savedClips');
    localStorage.setItem('savedClips', JSON.stringify(clips));
}

function deleteSavedClips() {
	clips = {data:[]};
	createClipsTable();
	localStorage.removeItem('savedClips');
}


//***********************//
// Video loop            //
//***********************//

function initVideoPlayers() {
	
	clips = getSavedClips();

	if(clips.data.length > 0) {			
		// init members
		videoOverlay = document.getElementById('overlay');
		videoPlayer1 = document.getElementById('player1');
		videoPlayer2 = document.getElementById('player2');
		videoIndex = 0;
		
		// create video sources
		videoSource1 = addVideoSource(videoPlayer1, 'media/generique.mp4');		
		videoSource2 = addVideoSource(videoPlayer2, 'media/transition.mp4');
			
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
		videoSource1.src = 'media/generique.mp4';
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
// Clips list            //
//***********************//

function submitDates() {
	var startDate = document.getElementById('start_date').value + 'T00:00:00Z';
	var endDate = document.getElementById('end_date').value + 'T23:59:59Z';
	
	fetchClips(BROADCASTER_ID, startDate, endDate).then( function(json) {
		clips = json;
		
		// sort clips
		clips.data.sort(function(clip1, clip2) {
			var date1 = clip1.created_at;
			var date2 = clip2.created_at;
			return date1.localeCompare(date2);
		});

		createClipsTable();
	});
}

function setAllClipsSelectionState(check) {
	var clipsCount = getClipsCount();
	
	for(let i=0; i<clipsCount; i++) {
		let currentCheckBox = document.getElementById(CLIP_SELECTED + i);
		let currentInput = document.getElementById(CLIP_INDEX + i);
		
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
		content.setAttribute('id', CLIP_SELECTED + i);
		content.setAttribute('checked', true);
		content.onclick = function() {
			clipSelectionHandler(CLIP_SELECTED + i, CLIP_INDEX + i);
		}
		
		// order
		cell = addCell(row);
		cell.style.width = '25px';
		
		content = addContent(cell, 'input');
		content.setAttribute('type', 'text');
		content.setAttribute('id', CLIP_INDEX + i);
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
	var clipsList = document.getElementById('clipsList');
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

function clipSelectionHandler(checkboxId, inputId) {
	let selectedCheckBox = document.getElementById(checkboxId);
	let selectedInput = document.getElementById(inputId);
	
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
		let clipsCount = getClipsCount();
		for(let i=0; i<clipsCount; i++) {
			let currentInput = document.getElementById(CLIP_INDEX + i)
			let currentalue = parseInt(currentInput.value);
			if(!isNaN(currentalue) && currentalue > selectedValue) {
				currentInput.value = currentalue - 1;
			}
		}
	}	
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

function show(elt) {
	elt.style.display = 'block';
}

function hide(elt) {
	elt.style.display = 'none';
}
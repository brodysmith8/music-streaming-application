"use strict"

// this script is a client-side script. It runs on a host outside of the
// AWS machine. Thus, we need to use the domain name of the AWS machine to
// connect to the backend. 

const currentApiServerIpAddress = 'localhost';

let filterMode = "";
let maxPlaylistId = 0;
let currentPlaylist = null;

// retrieve playlists and most listened songs
function createPlaylist(event) {
    let val = prompt("enter playlist name:", "playlist name");
    if (val) {
        addPlaylist(val).then((data) => {
            updatePlaylists();
        });
    } else {
        alert('Playlist name is null');
    }
}

async function addPlaylist(playlistName) {
    let str = `http://${currentApiServerIpAddress}:3000/api/playlists/` + (findMaxPlaylistId() + 1);
    let bObject = new Object;
    bObject.playlist_name = playlistName;
    bObject.user_id = 6;
    const response = await fetch(str, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(bObject)
    });
    return response.json();
}

async function addToPlaylist() {
    var promptResponseString = prompt("Enter the track IDs you want to add separated by a comma:", "e.g. 2, 5, 3, 4");
    if (promptResponseString) {
        // make sure they're all numbers
        let tracksToAdd = promptResponseString.split(',').map(g => { return g.trim() }).map(num => { return parseInt(num) }); // converting all the entered numbers to integers
        tracksToAdd = removeDuplicates(tracksToAdd);
        let currentPlaylistId = parseInt(currentPlaylist.innerText.split("\n\n")[3].substring(4));

        let str = `http://${currentApiServerIpAddress}:3000/api/playlists/` + (currentPlaylistId);
        let bObject = new Object;
        bObject.track_list = tracksToAdd;
        bObject.playlist_name = currentPlaylist.innerText.split("\n\n")[0];
        bObject.user_id = 6;

        const response = await fetch(str, {
            method: 'PUT',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(bObject)
        });

        if (response.ok) {
            updatePlaylists();
            let obj = new Object();
            obj.currentTarget = currentPlaylist;
            focusPlaylist(obj);
            return response.json();
        } else {
            alert("One of those track_ids doesn't exist.");
            return -1;
        }
    } else {
        alert('Playlist name is null');
    }
}

function removeDuplicates(arr) {
    const hashSet = new Set(); // new "object", implemented as hashSet

    return arr.filter((element) => {
        if (hashSet.has(element)) {
            return false;
        } else {
            hashSet.add(element);
            return true;
        }
    });
}

function displayPlaylist(playlistInfo) {
    const playlistContainer = document.getElementById("content-playlists-display");

    if (playlistContainer.children[0] && playlistContainer.children[0].innerText.slice(-4) === 'date') { // "last modified DATE" indicates the playlist is the default playlist
        clearChildren(playlistContainer);
    }

    // create info text
    const nameTn = document.createTextNode(playlistInfo.playlist_name);
    const songCountTn = document.createTextNode(playlistInfo.song_count);
    const runningTimeTn = document.createTextNode(playlistInfo.running_time);
    const idTn = document.createTextNode(playlistInfo.playlist_id);

    // create info text wrappers
    const nameWrapper = document.createElement('p');
    const songCountWrapper = document.createElement('p');
    const runningTimeWrapper = document.createElement('p');
    const idWrapper = document.createElement('p');

    nameWrapper.className = "playlist-title";
    songCountWrapper.className = "playlist-artist";
    runningTimeWrapper.className = "playlist-last-modified";
    idWrapper.className = "playlist-id";

    const songCountIdentifier = document.createTextNode("Song count: ");
    const runningTimeIdentifier = document.createTextNode("Running time (s): ");
    const idIdentifier = document.createTextNode("ID: ");

    nameWrapper.appendChild(nameTn);
    songCountWrapper.appendChild(songCountIdentifier);
    songCountWrapper.appendChild(songCountTn);
    runningTimeWrapper.appendChild(runningTimeIdentifier);
    runningTimeWrapper.appendChild(runningTimeTn);
    idWrapper.appendChild(idIdentifier);
    idWrapper.appendChild(idTn);

    // create cover wrapper 
    const coverWrapper = document.createElement('div');
    coverWrapper.className = "content-playlists-display-box-cover-wrapper";
    coverWrapper.innerHTML = '<img class=\"playlist-image\" src=\"../assets/images/placeholder.png\" />';

    // create info wrapper
    const infoWrapper = document.createElement('div');
    infoWrapper.className = "content-playlists-display-box-info-wrapper";
    infoWrapper.appendChild(nameWrapper);
    infoWrapper.appendChild(songCountWrapper);
    infoWrapper.appendChild(runningTimeWrapper);
    infoWrapper.appendChild(idWrapper);

    // create parent 
    const parent = document.createElement('div');
    parent.className = "content-playlists-display-box";

    parent.appendChild(coverWrapper);
    parent.appendChild(infoWrapper);

    parent.addEventListener("click", focusPlaylist);
    playlistContainer.appendChild(parent);

    findMaxPlaylistId();
}

function clearChildren(container) {
    while (container.firstChild) {
        container.removeChild(container.lastChild);
    }
}

async function focusPlaylist(event) {
    const songContainer = document.getElementById('content-main-display');
    changePaneTitle(songContainer, event.currentTarget.children[1].children[0].innerText); // change heading to playlist title
    clearChildren(songContainer);
    updateCurrentPlaylist(event.currentTarget);

    const id = parseInt(event.currentTarget.children[1].children[3].innerText.substring(4));
    getSongsByPlaylist(id).then((data) => {
        for (let i = 0; i < data.length; i++) {
            displaySong(data[i]);
        }
    });
}

function updateCurrentPlaylist(currentPlaylistElement) {
    // add event listener on old active playlist, remove event listener on current active playlist 
    if (currentPlaylist != null) {
        // add event listener on old active playlist
        currentPlaylist.addEventListener("click", focusPlaylist);

        // remove "add to playlist" btn on old active playlist
        currentPlaylist.children[1].removeChild(currentPlaylist.children[1].lastChild);

        // make the old cursor a pointer
        currentPlaylist.style.cursor = "pointer";
    }

    // remove event listener on current active playlist 
    currentPlaylist = currentPlaylistElement;
    currentPlaylist.removeEventListener("click", focusPlaylist);

    // add "add to playlist" button on current active playlist 
    let currentPlaylistInfoSection = currentPlaylist.children[1];
    const addToPlaylistTn = document.createTextNode("Add to playlist");
    const addToPlaylistWrapper = document.createElement('p');
    addToPlaylistWrapper.appendChild(addToPlaylistTn);
    addToPlaylistWrapper.addEventListener("click", addToPlaylist);
    addToPlaylistWrapper.style.cursor = "pointer";
    currentPlaylistInfoSection.appendChild(addToPlaylistWrapper);

    // change cursor style 
    currentPlaylist.style.cursor = "auto";
}

function displaySong(data) {
    const playlistContainer = document.getElementById("content-main-display");

    if (playlistContainer.children[0] && playlistContainer.children[0].innerText.slice(-9) === '# listens') { // "last modified DATE" indicates the playlist is the default playlist
        clearChildren(playlistContainer);
    }
    if (data !== 0 && data !== -1) {
        getSong(data).then((songData) => {
            // create info text
            const nameTn = document.createTextNode(songData.track_title);
            const artistTn = document.createTextNode(songData.artist_name);
            const runningTimeTn = document.createTextNode(songData.track_duration);
            const albumTn = document.createTextNode(songData.album_title);
            const trackIdTn = document.createTextNode(songData.track_id);

            // create info text wrappers
            const nameWrapper = document.createElement('p');
            const artistWrapper = document.createElement('p');
            const runningTimeWrapper = document.createElement('p');
            const albumWrapper = document.createElement('p');
            const trackIdWrapper = document.createElement('p');

            nameWrapper.className = "playlist-title";
            artistWrapper.className = "playlist-artist";
            runningTimeWrapper.className = "playlist-last-modified";
            albumWrapper.className = "playlist-id";
            trackIdWrapper.className = "playlist-id";

            const artistIdentifier = document.createTextNode("Artist: ");
            const runningTimeIdentifier = document.createTextNode("Running time (mm:ss): ");
            const albumIdentifier = document.createTextNode("Album: ");
            const trackIdIdentifier = document.createTextNode("track_id: ");

            nameWrapper.appendChild(nameTn);
            artistWrapper.appendChild(artistIdentifier);
            artistWrapper.appendChild(artistTn);
            runningTimeWrapper.appendChild(runningTimeIdentifier);
            runningTimeWrapper.appendChild(runningTimeTn);
            albumWrapper.appendChild(albumIdentifier);
            albumWrapper.appendChild(albumTn);
            trackIdWrapper.appendChild(trackIdIdentifier);
            trackIdWrapper.appendChild(trackIdTn);

            // create cover wrapper 
            const coverWrapper = document.createElement('div');
            coverWrapper.className = "content-artists-display-box-cover-wrapper";
            coverWrapper.innerHTML = '<img class=\"playlist-image\" src=\"../assets/images/placeholder.png\" />';

            // create info wrapper
            const infoWrapper = document.createElement('div');
            infoWrapper.className = "content-artists-display-box-info-wrapper";
            infoWrapper.appendChild(nameWrapper);
            infoWrapper.appendChild(artistWrapper);
            infoWrapper.appendChild(runningTimeWrapper);
            infoWrapper.appendChild(albumWrapper);
            infoWrapper.appendChild(trackIdWrapper);

            // create parent 
            const parent = document.createElement('div');
            parent.className = "content-artists-display-box";

            parent.appendChild(coverWrapper);
            parent.appendChild(infoWrapper);

            playlistContainer.appendChild(parent);

        });
    } else if (data === 0) {
        // create info text
        const nameTn = document.createTextNode("Empty playlist.");

        // create info text wrappers
        const nameWrapper = document.createElement('p');

        nameWrapper.appendChild(nameTn);

        // create info wrapper
        const infoWrapper = document.createElement('div');
        infoWrapper.className = "content-artists-display-box-info-wrapper";
        infoWrapper.appendChild(nameWrapper);

        // create parent 
        const parent = document.createElement('div');
        parent.className = "content-artists-display-box";
        parent.appendChild(infoWrapper);

        playlistContainer.appendChild(parent);
    } else if (data === -1) {
        // create info text
        const nameTn = document.createTextNode("No results found.");

        // create info text wrappers
        const nameWrapper = document.createElement('p');

        nameWrapper.appendChild(nameTn);

        // create info wrapper
        const infoWrapper = document.createElement('div');
        infoWrapper.className = "content-artists-display-box-info-wrapper";
        infoWrapper.appendChild(nameWrapper);

        // create parent 
        const parent = document.createElement('div');
        parent.className = "content-artists-display-box";
        parent.appendChild(infoWrapper);

        playlistContainer.appendChild(parent);
    }
}

function findMaxPlaylistId() {
    const lastChildText = document.getElementById('content-playlists-display').lastChild.innerText;
    maxPlaylistId = parseInt(lastChildText.split("\n\n")[3].substring(4));
    return maxPlaylistId;
}

function changePaneTitle(child, text) {
    child.parentElement.children[0].innerText = text;
}

async function getSongsByPlaylist(playlistId) {
    const str = `http://${currentApiServerIpAddress}:3000/api/playlists/` + playlistId;
    const abc = await fetch(str);
    if (abc.ok) {
        const data = await abc.json();
        return data;
    } else {
        return abc.status;
    }
}

async function getSong(track_id) {
    const str = `http://${currentApiServerIpAddress}:3000/api/tracks/` + track_id;
    const abc = await fetch(str);
    if (abc.ok) {
        const data = await abc.json();
        return data;
    } else {
        return -1;
    }
}

function search() {
    const songsContainer = document.getElementById('content-main-display');
    clearChildren(songsContainer);
    changePaneTitle(songsContainer, "Search Results");
    const query = getSearchQuery();
    const type = document.getElementById("search-filter-select").value;
    const result = getSearchResult(query, type).then((data) => {
        if (data != 404) {
            for (let i = 0; i < data.length; i++) {
                displaySong(data[i].track_id);
            }
        } else {
            displaySong(data);
        }
    });
}

function displaySearch() {

}

function getSearchQuery() {
    // add input validation here
    let query = document.getElementsByClassName('search-bar')[0].value;
    if (query.length > 20) {
        alert("Query too long");
        return;
    }

    return query;
}

async function getSearchResult(query, type) {
    // this will return track_ids from backend requirement 4
    const str = `http://${currentApiServerIpAddress}:3000/api/tracks?query=` + query + "&type=" + type;
    const abc = await fetch(str);
    if (abc.ok) {
        const data = await abc.json();
        return data;
    } else {
        return abc.status;
    }
}

async function getPlaylists() {
    const abc = await fetch(`http://${currentApiServerIpAddress}:3000/api/playlists`);
    if (abc.ok) {
        const data = await abc.json();
        return data;
    } else {
        return abc.status;
    }
}

function sortBy() {
    // filter by artist, track, album or length

}

function setFilterMode(str) {
    if (str === "songs") {
        filterMode = str;
        return str;
    } else if (str === "playlists") {
        filterMode = str;
        return str;
    } else if (str === "albums") {
        filterMode = str;
        return str;
    } else if (str === "artists") {
        filterMode = str;
        return str;
    } else {
        return "no mode found";
    }
}

function updatePlaylists() {
    clearChildren(document.getElementById("content-playlists-display"));
    getPlaylists().then((data) => {
        for (let i = 0; i < data.length; i++) {
            displayPlaylist(data[i]);
        }
    },);
}

clearChildren(document.getElementById("content-main-display"));

document.getElementsByClassName('search-button')[0].addEventListener('click', search);
document.getElementsByClassName('log-in-btn')[0].addEventListener('click', createPlaylist);


updatePlaylists();
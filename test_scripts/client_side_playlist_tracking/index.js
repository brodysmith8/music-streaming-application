"use strict"

// example object in literal form:
// let playlist_object = { 
//     playlist_name = "Abc 123",
//     playlist_tracks = [ 123, 132, 3232, 3232 ] // array literal
// }

class PlaylistObject { 
    constructor(playlist_name, track_ids) {
        this.name = playlist_name,
        this.track_ids = track_ids
    }
}

// you would use an array to store all active playlists:
let active_playlists = new Array();

let playlist_1 = new PlaylistObject("First Playlist", [ 1, 2, 3, 4, 5 ]);
let playlist_2 = new PlaylistObject("Second Playlist", [ 6, 7, 8 ]);
let playlist_3 = new PlaylistObject("Third Playlist", [ 9, 10 ]);
let playlist_4 = new PlaylistObject("Fourth Playlist", [ 11, 12, 13, 14, 15 ]);

active_playlists.push(playlist_1);
active_playlists.push(playlist_2);
active_playlists.push(playlist_3);
active_playlists.push(playlist_4);

console.log(active_playlists);
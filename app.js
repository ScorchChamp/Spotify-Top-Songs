window.addEventListener("load", function () {
const url_string = window.location.href.replace("#", "?");
const url = new URL(url_string);
const token_type = url.searchParams.get("filename");
const OAUTH = `${url.searchParams.get("token_type")} ${url.searchParams.get("access_token")}`
const appContainer = document.getElementById("app-container");

function parseArtists(artists) {
    return artists.map(artist => {
        return artist.name
    }).join(', ')
}

function parseSong(song, index) {
    const track = song.track
    console.log(track)
    return `
        <div class="song">
            <a href='${track.external_urls.spotify}'>
                <div class="left">
                    <div class="cover-image">
                        <img src="${track.album.images[0].url}">
                    </div>
                </div>
                <div class="right">
                        <div class="title">${index+1}. ${track.name}</div>
                        <div class="artist">${parseArtists(track.artists)}</div>
                </div>
            </a>
        </div>
    `
}

if (OAUTH === 'null null') {
    const client_id = '6df11dc7c93c4c7ca2028a19177670b9';
    const redirect_uri = document.location.href;
    const scope = '';
    let generateRandomString = (length) => (Math.random() + 1).toString(36).substring(length);
    var state = generateRandomString(16);
    localStorage.setItem('csrf', state);
    let req_url = 'https://accounts.spotify.com/authorize';
    req_url += '?response_type=token';
    req_url += `&client_id=${client_id}`;
    req_url += `&scope=${scope}`;
    req_url += `&redirect_uri=${redirect_uri}`;
    req_url += `&state=${state}`;
    window.location.replace(req_url);
} else {
    const playlist_id = '37i9dQZEVXbMDoHDwVN2tF';
    const req_url = `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`; 
    fetch(req_url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': OAUTH
        },
    })
    .then((response) => response.json())
    .then((data) => {
        data.items.map((element, index) => {
            appContainer.innerHTML += parseSong(element, index)
        });
    })
    .catch((error) => {
        document.getElementById('error').style.display = 'block';
        console.log(error);
    })
}
});

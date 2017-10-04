const clientId = 'e1d75cc360424af89800574c525a3b22';
const redirectUri = 'http://vestial_jammming.surge.sh';

let accessToken;

const Spotify = {

  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }

    const windowAccessToken = window.location.href.match(/access_token=([^&]*)/);
    const windowExpiresIn = window.location.href.match(/expires_in=([^&]*)/);
    if (windowExpiresIn && windowAccessToken) {
      accessToken = windowAccessToken[1]; // Needs to be [1] since it shows as 2nd in array.
      const expiresIn = Number(windowExpiresIn[1]); // 2nd in array, but also need to convert to number
      window.setTimeout(() => accessToken = '', expiresIn * 1000); //this is token expiration
      window.history.pushState('Access Token', null, '/'); //clears params from URL
      return accessToken;
    }

    else {
      const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
      window.location = accessUrl;
    }
  },

  search(term) {
    const accessToken = Spotify.getAccessToken();
    let endPointUrl = 'https://api.spotify.com/v1/search?type=track&q=';
    return fetch(`${endPointUrl}${term}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }).then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Request failed!');
    }, networkError => console.log(networkError.message)
      ).then(jsonResponse => {
        if (!jsonResponse.tracks) {
          return [];
        }
        return jsonResponse.tracks.items.map(track => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri
        }));
      });
  },

  savePlaylist(name, trackUris) {
    if (!name || !trackUris) {
      return;
    }

    const accessToken = Spotify.getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };
    let userId;
    let userIdUrl = 'https://api.spotify.com/v1/me';

    return fetch(userIdUrl, {
      headers: headers
    }).then(response => {
      if (response.ok) {
        return response.json();
      }
    }).then(jsonResponse => {
      userId = jsonResponse.id;
      return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        headers: headers,
        method: 'POST',
        body: JSON.stringify({ name: name })
      }).then(response => response.json()
        ).then(jsonResponse => {
          let playlistId = jsonResponse.id;
          fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
            headers: headers,
            method: 'POST',
            body: JSON.stringify({ uris: trackUris })
          });
        });
    });
  }
};

export default Spotify;
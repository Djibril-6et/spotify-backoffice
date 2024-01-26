// const API_URL_BASE = process.env.API_BASE_URL;
const API_URL_BASE = 'https://spotify-api-r80c.onrender.com/api';

export default {
  getArtists() {
    return fetch(`${API_URL_BASE}/artist`).then(response => response.json());
  },

  newTrack(payload) {
    return fetch(`${API_URL_BASE}/artist/new-artist`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(payload),
    }).then(res => res.json());
  },

  updateArtist(id, payload) {
    return fetch(`${API_URL_BASE}/artist/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(payload),
    }).then(res => res.json());
  },

  deleteArtist(id) {
    return fetch(`${API_URL_BASE}/artist/delete/${id}`, {
      method: 'DELETE',
    }).then(res => res.json());
  },
};

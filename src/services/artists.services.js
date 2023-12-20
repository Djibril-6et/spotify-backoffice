// const API_URL_BASE = process.env.API_BASE_URL;
const API_URL_BASE = 'http://localhost:9000/api';

export default {
  getArtists() {
    return fetch(`${API_URL_BASE}/artist`).then(response => response.json());
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

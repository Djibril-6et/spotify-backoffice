const API_URL_BASE = 'http://localhost:9000/api';

export default {
  getAlbums() {
    return fetch(`${API_URL_BASE}/album`).then(response => response.json());
  },

  updateAlbum(id, payload) {
    return fetch(`${API_URL_BASE}/album/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(payload),
    }).then(res => res.json());
  },

  deleteAlbum(id) {
    return fetch(`${API_URL_BASE}/album/delete/${id}`, {
      method: 'DELETE',
    }).then(res => res.json());
  },
};

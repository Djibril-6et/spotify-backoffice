// const API_URL_BASE = process.env.API_BASE_URL;
const API_URL_BASE = 'http://localhost:9000/api';

export default {
  getTracks() {
    return fetch(`${API_URL_BASE}/track`).then(response => response.json());
  },

  getCountTracks() {
    return fetch(`${API_URL_BASE}/track/total`).then(response =>
      response.json(),
    );
  },

  newTrack(payload) {
    return fetch(`${API_URL_BASE}/track/new-track`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(payload),
    }).then(res => res.json());
  },

  updateTrack(id, payload) {
    return fetch(`${API_URL_BASE}/track/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(payload),
    }).then(res => res.json());
  },

  deleteTrack(id) {
    return fetch(`${API_URL_BASE}/track/delete/${id}`, {
      method: 'DELETE',
    }).then(res => res.json());
  },
};

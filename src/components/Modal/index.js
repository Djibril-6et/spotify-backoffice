import React, {useEffect, useState} from 'react';
import '../../styles/components/modal.scss';
import artistsServices from '@/services/artists.services';

const Index = props => {
  const [artist, setArtist] = useState({
    _id: '',
    name: '',
    albums: [],
    tracks: [],
  });

  const [album, setAlbum] = useState({
    _id: '',
    title: '',
    tracks: [],
  });

  if (props.type == 'artist') {
    useEffect(() => {
      setArtist(prevArtist => ({
        ...prevArtist,
        _id: props.artist._id,
        name: props.artist.name,
        albums: props.artist.albums,
        tracks: props.artist.tracks,
      }));
    }, [
      props.artist._id,
      props.artist.name,
      props.artist.albums,
      props.artist.tracks,
    ]);
  } else if (props.type == 'album') {
    useEffect(() => {
      setAlbum(prevAlbum => ({
        ...prevAlbum,
        _id: props.album._id,
        title: props.album.title,
        tracks: props.album.tracks,
      }));
    }, [props.album._id, props.album.title, props.album.tracks]);
  }

  const handleInput = e => {
    if (props.type == 'artist') {
      setArtist({...artist, [e.target.name]: e.target.value});
    } else if (props.type == 'album') {
      setAlbum({...album, [e.target.name]: e.target.value});
    }
  };

  const removeAlbum = albumId => {
    setArtist(prevArtist => ({
      ...prevArtist,
      albums: prevArtist.albums.filter(id => id !== albumId),
    }));
  };

  const removeTrack = trackId => {
    if (props.type == 'artist') {
      setArtist(prevArtist => ({
        ...prevArtist,
        tracks: prevArtist.tracks.filter(id => id !== trackId),
      }));
    } else if (props.type == 'album') {
      setAlbum(prevAlbum => ({
        ...prevAlbum,
        tracks: prevAlbum.tracks.filter(id => id !== trackId),
      }));
    }
  };

  const applyChanges = (e, id, new_artist) => {
    e.preventDefault();
    artistsServices
      .updateArtist(id, new_artist)
      .then(user => {
        console.log(user);
      })
      .catch(err => console.log(err));
  };

  return props.isActive ? (
    <>
      <div className="modal__wrapper" onClick={props.closeFunction}></div>
      <div className="modal__content">
        <div className="modal__content__top">
          <p
            className="modal__content__top__close"
            onClick={props.closeFunction}>
            X
          </p>
        </div>
        {props.type === 'artist' ? (
          <>
            <div className="modal__content__data">
              <label htmlFor="artistName">Name : </label>
              <input
                id="artistName"
                name="name"
                type="text"
                value={artist.name}
                onChange={e => {
                  handleInput(e);
                }}
              />
              <h3>Albums:</h3>
              <ul>
                {artist.albums.map(albumId => (
                  <li key={albumId}>
                    <p>{albumId}</p>
                    <button onClick={() => removeAlbum(albumId)}>
                      Remove Album
                    </button>
                  </li>
                ))}
              </ul>
              <h3>Tracks:</h3>
              <ul>
                {artist.tracks.map(trackId => (
                  <li key={trackId}>
                    <p>{trackId}</p>
                    <button onClick={() => removeTrack(trackId)}>
                      Remove Track
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="modal__content__bottom">
              <button onClick={e => applyChanges(e, artist._id, artist)}>
                Edit
              </button>
            </div>
          </>
        ) : props.type === 'album' ? (
          <>
            <div className="modal__content__data">
              <label htmlFor="albumTitle">Title : </label>
              <input
                id="albumTitle"
                name="title"
                type="text"
                value={album.title}
                onChange={e => {
                  handleInput(e);
                }}
              />
              <h3>Tracks :</h3>
              <ul>
                {album.tracks.map(trackId => (
                  <li key={trackId}>
                    <p>{trackId}</p>
                    <button onClick={() => removeTrack(trackId)}>
                      Remove Track
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="modal__content__bottom">
              <button onClick={e => applyChanges(e, album._id, album)}>
                Edit
              </button>
            </div>
          </>
        ) : props.type === 'track' ? (
          <h1>TRACK</h1>
        ) : null}
      </div>
    </>
  ) : null;
};

export default Index;

//657c16161f653b8b88011684

// {
//   "_id": "657c16161f653b8b8801166b",
//   "name": "Elvis Presley",
//   "__v": 0,
//   "albums": [
//       "657c16311f653b8b8801539e"
//   ],
//   "tracks": [
//       "657c1616443a5db04091c22a",
//       "657c1617443a5db04091c231",
//       "657c1617443a5db04091c238",
//       "657c1617443a5db04091c23f",
//       "657c1617443a5db04091c246",
//       "657c1617443a5db04091c24d",
//       "657c1617443a5db04091c254",
//       "657c1617443a5db04091c25b",
//       "657c1617443a5db04091c262",
//       "657c1617443a5db04091c269",
//       "657c1617443a5db04091c270",
//       "657c1617443a5db04091c277",
//       "657c1631443a5db04091cbba",
//       "657c1631443a5db04091cbc1",
//       "657c1631443a5db04091cbc8",
//       "657c1631443a5db04091cbcf",
//       "657c1631443a5db04091cbd6",
//       "657c1631443a5db04091cbdd",
//       "657c1631443a5db04091cbe4",
//       "657c1632443a5db04091cbeb",
//       "657c1632443a5db04091cbf2",
//       "657c1632443a5db04091cbf9",
//       "657c1632443a5db04091cc00",
//       "657c1632443a5db04091cc07"
//   ]
// }

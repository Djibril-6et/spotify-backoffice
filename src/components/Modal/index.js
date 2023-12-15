import React, {useEffect, useState} from 'react';
import '../../styles/components/modal.scss';
import artistsServices from '@/services/artists.services';
import albumsServices from '@/services/albums.services';

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

  const applyChanges = (e, id, new_values) => {
    e.preventDefault();
    if (props.type == 'artist') {
      artistsServices
        .updateArtist(id, new_values)
        .then(artist => {
          console.log(artist);
        })
        .catch(err => console.log(err));
    } else if (props.type == 'album') {
      albumsServices
        .updateAlbum(id, new_values)
        .then(album => {
          console.log(album);
        })
        .catch(err => console.log(err));
    }
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

import React, {useEffect, useState} from 'react';
import '../../styles/components/modal.scss';
import artistsServices from '@/services/artists.services';
import albumsServices from '@/services/albums.services';
import Button from '../Button';
import tracksServices from '@/services/tracks.services';
import {DndProvider, useDrag, useDrop} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';
import {Toaster, toast} from 'sonner';

const DraggableTrack = ({trackId, index, removeTrack, updateTrackOrder}) => {
  const [, ref] = useDrag({
    type: 'TRACK',
    item: {index},
  });

  const [, drop] = useDrop({
    accept: 'TRACK',
    hover: item => {
      const draggedIndex = item.index;
      const targetIndex = index;

      console.log('Dragging track:', trackId);
      console.log('Dragged from index:', draggedIndex);
      console.log('Dropped at index:', targetIndex);

      if (draggedIndex === targetIndex) {
        return;
      }

      updateTrackOrder(draggedIndex, targetIndex);
      item.index = targetIndex;
    },
  });

  return (
    <li ref={node => ref(drop(node))}>
      <p>{trackId}</p>
      <button onClick={removeTrack}>Remove Track</button>
    </li>
  );
};

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

  const [track, setTrack] = useState({
    _id: '',
    title: '',
    duration: '',
    url: '',
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
  } else if (props.type == 'track') {
    useEffect(() => {
      setTrack(prevTrack => ({
        ...prevTrack,
        _id: props.track._id,
        title: props.track.title,
        duration: props.track.duration,
        url: props.track.url,
      }));
    }, [
      props.track._id,
      props.track.title,
      props.track.duration,
      props.track.url,
    ]);
  }

  const handleInput = e => {
    if (props.type === 'artist') {
      setArtist({...artist, [e.target.name]: e.target.value});
    } else if (props.type === 'album') {
      setAlbum({...album, [e.target.name]: e.target.value});
    } else if (props.type === 'track') {
      setTrack({...track, [e.target.name]: e.target.value});
    }
  };

  const removeAlbum = albumId => {
    setArtist(prevArtist => ({
      ...prevArtist,
      albums: prevArtist.albums.filter(id => id !== albumId),
    }));
  };

  const removeTrack = trackId => {
    if (props.type === 'artist') {
      setArtist(prevArtist => ({
        ...prevArtist,
        tracks: prevArtist.tracks.filter(id => id !== trackId),
      }));
    } else if (props.type === 'album') {
      setAlbum(prevAlbum => ({
        ...prevAlbum,
        tracks: prevAlbum.tracks.filter(id => id !== trackId),
      }));
    }
  };

  const applyChanges = (id, new_values, updatedArtist) => {
    if (props.type === 'artist') {
      artistsServices
        .updateArtist(id, new_values)
        .then(artist => {
          console.log(artist);
        })
        .catch(err => console.log(err));
    } else if (props.type === 'album') {
      albumsServices
        .updateAlbum(id, new_values)
        .then(album => {
          console.log(album);
        })
        .catch(err => console.log(err));
    } else if (props.type === 'track') {
      tracksServices
        .updateTrack(id, new_values)
        .then(track => {
          console.log(track);
        })
        .catch(err => console.log(err));
    }
    props.updateList(updatedArtist);
    props.closeFunction();
  };

  const deleteElement = id => {
    if (props.type === 'artist') {
      artistsServices
        .deleteArtist(id)
        .then(del => {
          console.log(del);
        })
        .catch(err => console.log(err));
    } else if (props.type === 'album') {
      albumsServices
        .deleteAlbum(id)
        .then(del => {
          console.log(del);
        })
        .catch(err => console.log(err));
    } else if (props.type === 'track') {
      tracksServices
        .deleteTrack(id)
        .then(del => {
          console.log(del);
        })
        .catch(err => console.log(err));
    }

    props.closeFunction();
  };

  const pad = num => {
    return num < 10 ? `0${num}` : num;
  };

  const convertDuration = duration => {
    let seconds = parseInt(duration, 10);
    let hours = Math.floor(seconds / 3600);
    let minutes = Math.floor((seconds % 3600) / 60);
    let remainingSeconds = seconds % 60;
    let formattedDuration = `${pad(hours)}:${pad(minutes)}:${pad(
      remainingSeconds,
    )}`;
    return formattedDuration;
  };

  return props.isActive ? (
    <DndProvider backend={HTML5Backend}>
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
                <div className="modal__content__bottom__buttons">
                  <Button
                    label="Edit"
                    onClickFunction={() =>
                      toast.warning('Confirm updating ?', {
                        action: {
                          label: 'Yes',
                          onClick: () =>
                            applyChanges(artist._id, artist, props.updateList),
                        },
                      })
                    }
                  />
                  <Button
                    label="DELETE"
                    onClickFunction={() =>
                      toast.warning('Confirm deleting ?', {
                        action: {
                          label: 'Yes',
                          onClick: () => deleteElement(artist._id),
                        },
                      })
                    }
                  />
                  <Toaster richColors closeButton />
                </div>
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
                  onChange={e => handleInput(e)}
                />
                <h3>Tracks :</h3>
                <ul>
                  {album.tracks.map((trackId, index) => (
                    <DraggableTrack
                      key={trackId}
                      trackId={trackId}
                      index={index}
                      removeTrack={() => removeTrack(trackId)}
                      updateTrackOrder={(oldIndex, newIndex) => {
                        const updatedTracks = [...album.tracks];
                        updatedTracks.splice(
                          newIndex,
                          0,
                          updatedTracks.splice(oldIndex, 1)[0],
                        );
                        setAlbum(prevAlbum => ({
                          ...prevAlbum,
                          tracks: updatedTracks,
                        }));
                      }}
                    />
                  ))}
                </ul>
              </div>
              <div className="modal__content__bottom">
                <div className="modal__content__bottom__buttons">
                  <Button
                    label="Edit"
                    onClickFunction={() =>
                      toast.warning('Confirm updating ?', {
                        action: {
                          label: 'Yes',
                          onClick: () =>
                            applyChanges(album._id, album, props.updateList),
                        },
                      })
                    }
                  />
                  <Button
                    label="DELETE"
                    onClickFunction={() =>
                      toast.warning('Confirm deleting ?', {
                        action: {
                          label: 'Yes',
                          onClick: () => deleteElement(album._id),
                        },
                      })
                    }
                  />
                  <Toaster richColors closeButton />
                </div>
              </div>
            </>
          ) : props.type === 'track' ? (
            <>
              <div className="modal__content__data">
                <label htmlFor="trackTitle">Title : </label>
                <input
                  id="trackTitle"
                  name="title"
                  type="text"
                  value={track.title}
                  onChange={e => handleInput(e)}
                />
                <p>Duration : {track && convertDuration(track.duration)}</p>
                <audio controls src={track.url} />
              </div>
              <div className="modal__content__bottom">
                <div className="modal__content__bottom__buttons">
                  <Button
                    label="Edit"
                    onClickFunction={() =>
                      toast.warning('Confirm updating ?', {
                        action: {
                          label: 'Yes',
                          onClick: () =>
                            applyChanges(track._id, track, props.updateList),
                        },
                      })
                    }
                  />
                  <Button
                    label="DELETE"
                    onClickFunction={() =>
                      toast.warning('Confirm deleting ?', {
                        action: {
                          label: 'Yes',
                          onClick: () => deleteElement(track._id),
                        },
                      })
                    }
                  />
                  <Toaster richColors closeButton />
                </div>
              </div>
            </>
          ) : null}
        </div>
      </>
    </DndProvider>
  ) : null;
};

export default Index;

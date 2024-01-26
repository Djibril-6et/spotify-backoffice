'use client';
import React, {useEffect, useState} from 'react';
import Header from '../../../components/Header';
import '../../../styles/pages/new.scss';
// import Button from '../../../components/Button';
import artistsServices from '@/services/artists.services';
import albumsServices from '@/services/albums.services';
import tracksServices from '@/services/tracks.services';
import {uploadNewTrack} from '@/Functions/AddNewTrack';
import {addTrackToBase} from '@/Functions/AddFileToBase';
import axios from 'axios';

const musicMetadata = require('music-metadata-browser');

const Page = () => {
  const [activeSection, setActiveSection] = useState(null);
  const [inBaseArtists, setInBaseArtists] = useState();
  const [inBaseAlbums, setInBaseAlbums] = useState();
  const [inBaseTracks, setInBaseTracks] = useState();

  useEffect(() => {
    artistsServices
      .getArtists()
      .then(res => {
        setInBaseArtists(res);
      })
      .catch(err => console.log(err));

    albumsServices
      .getAlbums()
      .then(res => {
        setInBaseAlbums(res);
      })
      .catch(err => console.log(err));

    tracksServices
      .getTracks()
      .then(res => {
        setInBaseTracks(res);
      })
      .catch(err => console.log(err));
  }, []);

  const [artist, setArtist] = useState({
    name: '',
    albums: [],
    tracks: [],
  });

  const [album, setAlbum] = useState({
    title: '',
    tracks: [],
  });

  const [albumList, setAlbumList] = useState([
    {id: 1, title: 'Album 1'},
    {id: 2, title: 'Album 2'},
    {id: 3, title: 'Album 3'},
  ]);

  const toggleSection = section => {
    setActiveSection(activeSection === section ? null : section);
  };

  const handleNameChange = e => {
    setArtist({...artist, name: e.target.value});
  };

  const handleAlbumNameChange = e => {
    setAlbum({
      ...album,
      title: e.target.value,
    });
  };

  const handleAlbumAddition = e => {
    const selectedAlbumId = e.target.value;
    const selectedAlbum = inBaseAlbums.find(
      album => album._id === selectedAlbumId,
    );

    if (selectedAlbum) {
      // Récupérer les pistes associées à l'album
      const albumTracks = selectedAlbum.tracks || [];

      // Filtrer les pistes qui ne sont pas déjà présentes
      const newTracks = albumTracks.filter(
        trackId => !artist.tracks.includes(trackId),
      );

      setArtist({
        ...artist,
        albums: [...artist.albums, selectedAlbumId],
        tracks: [...artist.tracks, ...newTracks],
      });
    }
  };

  const handleTrackAddition = e => {
    const selectedTrackId = e.target.value;

    // Vérifier si la piste n'est pas déjà présente dans la liste des pistes de l'artiste
    if (!artist.tracks.includes(selectedTrackId)) {
      setArtist({
        ...artist,
        tracks: [...artist.tracks, selectedTrackId],
      });
    }
  };

  const createArtist = n_artist => {
    artistsServices
      .newTrack(n_artist)
      .then(newArtist => console.log(newArtist))
      .catch(err => console.log(err));
    // console.log(artist);
  };

  const handleAlbumTrackAddition = e => {
    const selectedTrackId = e.target.value;

    // Vérifier si la piste n'est pas déjà présente dans la liste des pistes de l'album
    if (!album.tracks.includes(selectedTrackId)) {
      setAlbum({
        ...album,
        tracks: [...album.tracks, selectedTrackId],
      });
    }
  };

  const handleAlbumCreation = () => {
    // Logique pour créer l'album avec les pistes sélectionnées
    console.log(album);
  };

  const [track, setTrack] = useState({
    audio: null,
    artist: '',
    album: '',
  });

  const handleAudioFileAddition = event => {
    const file = event.target.files[0];
    setTrack(prevTrack => ({
      ...prevTrack,
      audio: file,
    }));
  };

  const handleTrackArtistChange = event => {
    setTrack(prevTrack => ({
      ...prevTrack,
      artist: event.target.value,
    }));
  };

  const handleTrackAlbumChange = event => {
    setTrack(prevTrack => ({
      ...prevTrack,
      album: event.target.value,
    }));
  };

  const handleTrackUpload = () => {
    // Ensure that an audio file is selected before initiating the upload
    if (track.audio) {
      uploadNewTrack(track);

      console.log('Before FormData: ', track.audio);

      const formData = new FormData();
      formData.set('audio', track.audio, track.audio.name);

      console.log('BACK ', track);
      console.log('DATA ', formData);
      console.log("FormData.get('audio'):", formData.get('audio'));

      axios
        .post(
          'https://spotify-api-r80c.onrender.com/api/track/post-aws',
          formData,
        )
        .then(res => console.log(res))
        .catch(err => console.log(err));

      musicMetadata
        .parseBlob(track.audio)
        .then(metadata => {
          tracksServices
            .insertTrackToBaseFromFile(
              encodeURIComponent(metadata.common.title),
              encodeURIComponent(metadata.format.duration),
              track.audio.name,
              encodeURIComponent(metadata.common.album),
              encodeURIComponent(metadata.common.artist),
            )
            .then(res => console.log(res))
            .catch(err => console.log(err));
        })
        .catch(error => {
          console.error('Error parsing metadata: ', error);
        });
    } else {
      console.error('Please select an audio file before uploading.');
    }
  };

  // const uploadSingleTrack = track => {
  //   // Your existing uploadSingleTrack function goes here
  //   // Make sure to modify it as needed to handle the track object passed from this component
  //   uploadSingleTrack(track);
  // };

  return (
    <>
      <main>
        <Header />

        <div className="home__sections">
          {/* Section Artists */}
          <div
            className={`home__section ${
              activeSection === 'artists' && 'active'
            }`}>
            <div
              className="home__section__header"
              onClick={() => toggleSection('artists')}>
              <p className="home__section__title">Artists</p>
            </div>
            {/* Ajoute le contenu de la section Artists ici */}
            {activeSection === 'artists' && (
              <div className="home__section__content">
                <form>
                  <label htmlFor="artistName">Artist Name:</label>
                  <input
                    type="text"
                    id="artistName"
                    value={artist.name}
                    onChange={handleNameChange}
                  />

                  <label htmlFor="albumList">Add Albums:</label>
                  <select id="albumList" onChange={handleAlbumAddition}>
                    <option value="">Select an Album</option>
                    {inBaseAlbums &&
                      inBaseAlbums.map(album => (
                        <option key={album._id} value={album._id}>
                          {album.title}
                        </option>
                      ))}
                  </select>

                  {/* Display selected albums */}
                  {artist.albums.length > 0 && (
                    <div>
                      <h3>Selected Albums:</h3>
                      <ul>
                        {artist.albums.map(albumId => {
                          const album = inBaseAlbums.find(
                            a => a._id === albumId,
                          );
                          return (
                            <li key={albumId}>
                              {album ? album.title : 'Unknown Album'}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                  <label htmlFor="trackList">Add Tracks:</label>
                  <select id="trackList" onChange={handleTrackAddition}>
                    <option value="">Select a Track</option>
                    {inBaseTracks &&
                      inBaseTracks.map(track => (
                        <option key={track._id} value={track._id}>
                          {track.title}
                        </option>
                      ))}
                  </select>

                  {/* Display selected tracks */}
                  {artist.tracks.length > 0 && (
                    <div>
                      <h3>Selected Tracks:</h3>
                      <ul>
                        {artist.tracks.map(trackId => {
                          const track = inBaseTracks.find(
                            t => t._id === trackId,
                          );
                          return (
                            <li key={trackId}>
                              {track ? track.title : 'Unknown Track'}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </form>
                <button onClick={() => createArtist(artist)}>
                  Create Artist
                </button>
              </div>
            )}
          </div>

          {/* Section Albums */}
          <div
            className={`home__section ${
              activeSection === 'albums' && 'active'
            }`}>
            <div
              className="home__section__header"
              onClick={() => toggleSection('albums')}>
              <p className="home__section__title">Albums</p>
            </div>
            {/* Ajoute le contenu de la section Albums ici */}
            {activeSection === 'albums' && (
              <div className="home__section__content">
                <div
                  className={`home__section ${
                    activeSection === 'albums' && 'active'
                  }`}>
                  <div
                    className="home__section__header"
                    onClick={() => toggleSection('albums')}>
                    <p className="home__section__title">Albums</p>
                  </div>
                  {activeSection === 'albums' && (
                    <div className="home__section__content">
                      <form>
                        <label htmlFor="albumName">Album Name:</label>
                        <input
                          type="text"
                          id="albumName"
                          value={album.title}
                          onChange={handleAlbumNameChange}
                        />

                        <label htmlFor="albumTrackList">Add Tracks:</label>
                        <select
                          id="albumTrackList"
                          onChange={handleAlbumTrackAddition}>
                          <option value="">Select a Track</option>
                          {inBaseTracks.map(track => (
                            <option key={track._id} value={track._id}>
                              {track.title}
                            </option>
                          ))}
                        </select>

                        {/* Display selected tracks for the album */}
                        {album.tracks.length > 0 && (
                          <div>
                            <h3>Selected Tracks:</h3>
                            <ul>
                              {album.tracks.map(trackId => {
                                const track = inBaseTracks.find(
                                  t => t._id === trackId,
                                );
                                return (
                                  <li key={trackId}>
                                    {track ? track.title : 'Unknown Track'}
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        )}
                      </form>
                      <button onClick={() => handleAlbumCreation()}>
                        Create Album
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Section Tracks */}
          <div
            className={`home__section ${
              activeSection === 'tracks' && 'active'
            }`}>
            <div
              className="home__section__header"
              onClick={() => toggleSection('tracks')}>
              <p className="home__section__title">Tracks</p>
            </div>
            {/* Content of the Tracks section */}
            {activeSection === 'tracks' && (
              <div className="home__section__content">
                <form>
                  {/* Add audio file input */}
                  <label htmlFor="audioFile">Add Audio File:</label>
                  <input
                    type="file"
                    id="audioFile"
                    accept="audio/*"
                    onChange={handleAudioFileAddition}
                  />

                  {/* Input for Artist */}
                  {/* <label htmlFor="trackArtist">Artist:</label>
                  <input
                    type="text"
                    id="trackArtist"
                    value={track.artist}
                    onChange={handleTrackArtistChange}
                  /> */}

                  {/* Input for Album */}
                  {/* <label htmlFor="trackAlbum">Album:</label>
                  <input
                    type="text"
                    id="trackAlbum"
                    value={track.album}
                    onChange={handleTrackAlbumChange}
                  /> */}

                  {/* Display selected audio file, artist, and album */}
                  {track.audio && (
                    <div>
                      <h3>Selected Audio File:</h3>
                      <p>{track.audio.name}</p>
                    </div>
                  )}
                  {/* {track.artist && (
                    <div>
                      <h3>Selected Artist:</h3>
                      <p>{track.artist}</p>
                    </div>
                  )}
                  {track.album && (
                    <div>
                      <h3>Selected Album:</h3>
                      <p>{track.album}</p>
                    </div>
                  )} */}
                </form>
                <button
                  onClick={e => {
                    e.preventDefault();
                    handleTrackUpload(e);
                  }}>
                  Upload Track
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default Page;

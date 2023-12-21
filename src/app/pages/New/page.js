'use client';
import React, {useEffect, useState} from 'react';
import Header from '../../../components/Header';
import '../../../styles/pages/new.scss';
import Button from '../../../components/Button';
import artistsServices from '@/services/artists.services';
import albumsServices from '@/services/albums.services';
import tracksServices from '@/services/tracks.services';

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
    // artistsServices
    //   .newTrack(n_artist)
    //   .then(newArtist => console.log(newArtist))
    //   .catch(err => console.log(err));
    console.log(artist);
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
                    {inBaseAlbums.map(album => (
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
                    {inBaseTracks.map(track => (
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
                <Button
                  label="Create"
                  onClickFunction={() => createArtist(artist)}
                />
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
                      <Button
                        label="Create Album"
                        onClickFunction={() => handleAlbumCreation()}
                      />
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
            {/* Ajoute le contenu de la section Tracks ici */}
            {activeSection === 'tracks' && (
              <div className="home__section__content">
                {/* Contenu de la section Tracks */}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default Page;

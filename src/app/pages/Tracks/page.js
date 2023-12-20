'use client';
import React, {useEffect, useState} from 'react';
import Link from 'next/link';
import Header from '../../../components/Header';
import tracksServices from '@/services/tracks.services';
import '../../../styles/global/global.scss';
import '../../../styles/pages/artists.scss';
import Card from '../../../components/Card';
import Modal from '../../../components/Modal';

const Index = () => {
  const [tracks, setTracks] = useState([]);
  const [isModalActive, setIsModalActive] = useState(false);
  const [myTrack, setMyTrack] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [delayTimeout, setDelayTimeout] = useState(null);

  useEffect(() => {
    if (searchTerm.trim() !== '') {
      if (delayTimeout) {
        clearTimeout(delayTimeout);
      }

      const newTimeout = setTimeout(() => {
        tracksServices
          .getTracks()
          .then(res => {
            console.log('res ', res);
            setTracks(res);
          })
          .catch(err => console.log('err ', err));
      }, 300);

      setDelayTimeout(newTimeout);
    } else {
      tracksServices
        .getTracks()
        .then(res => {
          console.log('res ', res);
          setTracks(res);
        })
        .catch(err => console.log('err ', err));
    }
  }, [searchTerm]);

  const closeFunction = () => {
    tracksServices
      .getTracks()
      .then(res => {
        console.log('res ', res);
        setTracks(res);
      })
      .catch(err => console.log('err ', err));
    setIsModalActive(!isModalActive);
  };

  const [forceUpdateIndex, setForceUpdateIndex] = useState(0);

  const updateTrackList = updatedTrack => {
    if (updatedTrack && updatedTrack._id) {
      const updatedTracks = tracks.map(track =>
        track._id === updatedTrack._id ? updatedTrack : track,
      );
      setTracks(updatedTracks);
      setForceUpdateIndex(prev => prev + 1);
    } else {
      console.error("L'objet updatedTrack est invalide :", updatedTrack);
    }
  };

  return (
    <>
      <main>
        <Header />
        {isModalActive ? (
          <Modal
            isActive={isModalActive}
            closeFunction={() => closeFunction()}
            type="track"
            track={myTrack}
            updateList={updateTrackList}
          />
        ) : (
          ''
        )}
        <div className="artist__list">
          <div className="artist__list__high">
            <p className="artist__list__high__title">Track List</p>
            <input
              type="text"
              className="artist__list__high__searchbar"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <ul className="artist__list__list">
            {tracks &&
              tracks
                .filter(track =>
                  track.title.toLowerCase().includes(searchTerm.toLowerCase()),
                )
                .map(track => (
                  <li
                    key={track._id}
                    onClick={e => {
                      e.preventDefault();
                      setMyTrack(track);
                      console.log(myTrack);
                      setIsModalActive(!isModalActive);
                    }}>
                    <Card key={track._id} type="track" track={track} />
                  </li>
                ))}
          </ul>
        </div>
      </main>
    </>
  );
};

export default Index;

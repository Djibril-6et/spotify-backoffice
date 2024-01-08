'use client';
import React, {useEffect, useState} from 'react';
import Link from 'next/link';
import Header from '../../../components/Header';
import artistsServices from '@/services/artists.services';
import '../../../styles/global/global.scss';
import '../../../styles/pages/artists.scss';
import Card from '../../../components/Card';
import Modal from '../../../components/Modal';

const Index = () => {
  const [artists, setArtists] = useState([]);
  const [isModalActive, setIsModalActive] = useState(false);
  const [myArtist, setMyArtist] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [delayTimeout, setDelayTimeout] = useState(null);

  useEffect(() => {
    if (searchTerm.trim() !== '') {
      if (delayTimeout) {
        clearTimeout(delayTimeout);
      }

      const newTimeout = setTimeout(() => {
        artistsServices
          .getArtists()
          .then(res => {
            console.log('res ', res);
            setArtists(res);
          })
          .catch(err => console.log('err ', err));
      }, 300);

      setDelayTimeout(newTimeout);
    } else {
      artistsServices
        .getArtists()
        .then(res => {
          console.log('res ', res);
          setArtists(res);
        })
        .catch(err => console.log('err ', err));
    }
  }, [searchTerm]);

  const closeFunction = () => {
    artistsServices
      .getArtists()
      .then(res => {
        console.log('res ', res);
        setArtists(res);
      })
      .catch(err => console.log('err ', err));
    setIsModalActive(!isModalActive);
  };

  const [forceUpdateIndex, setForceUpdateIndex] = useState(0);

  const updateArtistList = updatedArtist => {
    if (updatedArtist && updatedArtist._id) {
      const updatedArtists = artists.map(artist =>
        artist._id === updatedArtist._id ? updatedArtist : artist,
      );
      setArtists(updatedArtists);
      setForceUpdateIndex(prev => prev + 1);
    } else {
      console.error("L'objet updatedArtist est invalide :", updatedArtist);
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
            type="artist"
            artist={myArtist}
            updateList={updateArtistList}
          />
        ) : (
          ''
        )}
        <div className="artist__list">
          <div className="artist__list__high">
            <p className="artist__list__high__title">Artist List</p>
            <input
              type="text"
              className="artist__list__high__searchbar"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <ul className="artist__list__list">
            {artists &&
              artists
                .filter(artist =>
                  artist.name.toLowerCase().includes(searchTerm.toLowerCase()),
                )
                .map(artist => (
                  <li
                    key={artist._id}
                    onClick={e => {
                      e.preventDefault();
                      setMyArtist(artist);
                      console.log(myArtist);
                      setIsModalActive(!isModalActive);
                    }}>
                    <Card key={artist._id} type="artist" artist={artist} />
                  </li>
                ))}
          </ul>
        </div>
      </main>
    </>
  );
};

export default Index;

// {
//   "_id": "6584ad7516f4726898740ce1",
//   "name": "Elvis Presley",
//   "__v": 0,
//   "albums": [
//       "6584ad7516f4726898740cf7",
//       "6584ad8e16f4726898744809"
//   ],
//   "tracks": [
//       "6584ad75b15af1ca579405a5",
//       "6584ad76b15af1ca579405ab",
//       "6584ad76b15af1ca579405b1",
//       "6584ad76b15af1ca579405b7",
//       "6584ad76b15af1ca579405bd",
//       "6584ad76b15af1ca579405c3",
//       "6584ad76b15af1ca579405c9",
//       "6584ad76b15af1ca579405cf",
//       "6584ad76b15af1ca579405d5",
//       "6584ad76b15af1ca579405db",
//       "6584ad76b15af1ca579405e1",
//       "6584ad76b15af1ca579405e7",
//       "6584ad8eb15af1ca57940de5",
//       "6584ad8eb15af1ca57940deb",
//       "6584ad8eb15af1ca57940df1",
//       "6584ad8eb15af1ca57940df7",
//       "6584ad8eb15af1ca57940dfd",
//       "6584ad8eb15af1ca57940e03",
//       "6584ad8eb15af1ca57940e09",
//       "6584ad8eb15af1ca57940e0f",
//       "6584ad8eb15af1ca57940e15",
//       "6584ad8eb15af1ca57940e1b",
//       "6584ad8eb15af1ca57940e21",
//       "6584ad8eb15af1ca57940e27"
//   ]
// }

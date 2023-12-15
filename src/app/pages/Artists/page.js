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
  const [myArtist, setMyArtist] = useState();

  useEffect(() => {
    artistsServices
      .getArtists()
      .then(res => {
        console.log('res ', res);
        setArtists(res);
      })
      .catch(err => console.log('err ', err));
  }, []);

  return (
    <>
      <main>
        <Header />
        {isModalActive ? (
          <Modal
            isActive={isModalActive}
            closeFunction={() => setIsModalActive(!isModalActive)}
            type="artist"
            artist={myArtist}
          />
        ) : (
          ''
        )}
        <div className="artist__list">
          <div className="artist__list__high">
            <p className="artist__list__high__title">Artist List</p>
            <input type="text" className="artist__list__high__searchbar" />
          </div>
          <ul className="artist__list__list">
            {artists &&
              artists.map(artist => (
                <li
                  key={artist.id}
                  onClick={e => {
                    e.preventDefault;
                    setMyArtist(artist);
                    console.log(myArtist);
                    setIsModalActive(!isModalActive);
                  }}>
                  <Card type="artist" artist={artist} />
                </li>
              ))}
          </ul>
        </div>
      </main>
    </>
  );
};

export default Index;

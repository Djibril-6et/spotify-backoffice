'use client';
import React, {useEffect, useState} from 'react';
import Link from 'next/link';
import Header from '../../../components/Header';
import albumsServices from '@/services/albums.services';
import '../../../styles/global/global.scss';
import '../../../styles/pages/artists.scss';
import Card from '../../../components/Card';
import Modal from '../../../components/Modal';

const Index = () => {
  const [albums, setAlbums] = useState([]);
  const [isModalActive, setIsModalActive] = useState(false);
  const [myAlbum, setMyAlbum] = useState();
  const [searchTerm, setSearchTerm] = useState('');
  const [delayTimeout, setDelayTimeout] = useState(null);

  // useEffect(() => {
  //   albumsServices
  //     .getAlbums()
  //     .then(res => {
  //       console.log('res ', res);
  //       setAlbums(res);
  //     })
  //     .catch(err => console.log('err ', err));
  // }, []);

  useEffect(() => {
    if (searchTerm.trim() !== '') {
      if (delayTimeout) {
        clearTimeout(delayTimeout);
      }

      const newTimeout = setTimeout(() => {
        albumsServices
          .getAlbums()
          .then(res => {
            console.log('res ', res);
            setAlbums(res);
          })
          .catch(err => console.log('err ', err));
      }, 30000);

      setDelayTimeout(newTimeout);
    } else {
      albumsServices
        .getAlbums()
        .then(res => {
          console.log('res ', res);
          setAlbums(res);
        })
        .catch(err => console.log('err ', err));
    }
  }, [searchTerm]);

  return (
    <>
      <main>
        <Header />
        {isModalActive ? (
          <Modal
            isActive={isModalActive}
            closeFunction={() => setIsModalActive(!isModalActive)}
            type="album"
            album={myAlbum}
          />
        ) : (
          ''
        )}
        <div className="artist__list">
          <div className="artist__list__high">
            <p className="artist__list__high__title">Albums List</p>
            <input
              type="text"
              className="artist__list__high__searchbar"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <ul className="artist__list__list">
            {albums &&
              albums
                .filter(album =>
                  album.title.toLowerCase().includes(searchTerm.toLowerCase()),
                )
                .map(album => (
                  <li
                    key={album._id}
                    onClick={e => {
                      e.preventDefault();
                      setMyAlbum(album);
                      console.log(myAlbum);
                      setIsModalActive(!isModalActive);
                    }}>
                    <Card type="album" album={album} />
                  </li>
                ))}
            {/* {albums &&
              albums.map(album => (
                <li
                  key={album.id}
                  onClick={e => {
                    e.preventDefault;
                    setMyAlbum(album);
                    console.log(myAlbum);
                    setIsModalActive(!isModalActive);
                  }}>
                  <Card type="album" album={album} />
                </li>
              ))} */}
          </ul>
        </div>
      </main>
    </>
  );
};

export default Index;

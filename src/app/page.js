'use client';
import {useEffect, useState} from 'react';
import Link from 'next/link';
import '../styles/global/global.scss';
import '../styles/pages/home.scss';
import Header from '../components/Header';
import tracksServices from '@/services/tracks.services';
import albumsServices from '@/services/albums.services';
import artistsServices from '@/services/artists.services';
const {
  NEXT_PUBLIC_ACCESS_KEY_ID,
  NEXT_PUBLIC_SECRET_ACCESS_KEY,
  NEXT_PUBLIC_API_BASE_URL,
} = process.env;
require('dotenv').config();

export default function Home() {
  const [countTracks, setCountTracks] = useState(0);
  const [countAlbums, setCountAlbums] = useState(0);
  const [countArtists, setCountArtists] = useState(0);

  useEffect(() => {
    tracksServices
      .getTracks()
      .then(res => {
        setCountTracks(res.length);
      })
      .catch(err => console.log('err ', err));

    albumsServices
      .getAlbums()
      .then(res => {
        setCountAlbums(res.length);
      })
      .catch(err => console.log('err ', err));

    artistsServices
      .getArtists()
      .then(res => {
        setCountArtists(res.length);
      })
      .catch(err => console.log('err ', err));
  }, []);

  return (
    <main>
      <Header />
      <div className="home__wrapper">
        <Link href="/pages/Tracks">
          <div className="home__wrapper__left">
            <div id="number__left" className="home__wrapper__content__number">
              <p className="home__wrapper__content__number__data">
                {countTracks && countTracks}
              </p>
            </div>
            <div id="type__left" className="home__wrapper__content__type">
              <p className="home__wrapper__content__type__name">Tracks</p>
            </div>
          </div>
        </Link>
        <Link href="/pages/Albums">
          <div className="home__wrapper__middle">
            <div id="number__middle" className="home__wrapper__content__number">
              <p className="home__wrapper__content__number__data">
                {countAlbums && countAlbums}
              </p>
            </div>
            <div id="type__middle" className="home__wrapper__content__type">
              <p className="home__wrapper__content__type__name">Album</p>
            </div>
          </div>
        </Link>
        <Link href="/pages/Artists">
          <div className="home__wrapper__right">
            <div id="number__right" className="home__wrapper__content__number">
              <p className="home__wrapper__content__number__data">
                {countArtists && countArtists}
              </p>
            </div>
            <div id="type__right" className="home__wrapper__content__type">
              <p className="home__wrapper__content__type__name">Artists</p>
            </div>
          </div>
        </Link>
      </div>
    </main>
  );
}

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import '../../styles/components/header.scss';
import BlackLogo from '../../assets/logo/black-logo.svg';

const Index = () => {
  return (
    <div className="header__main">
      <Link href="/">
        <div className="header__main__left">
          <Image
            className="header__main__left__logo"
            src={BlackLogo}
            alt="LOGO"
          />
          <h1 className="header__main__left__title">BackOffice</h1>
        </div>
      </Link>
      <div className="header__main__right">
        <nav className="header__main__right__nav">
          <ul className="header__main__right__nav__list">
            <li className="header__main__right__nav__list__item">
              <Link href="/pages/Artists">
                <p className="nav__link">Artists</p>
              </Link>
            </li>
            <li className="header__main__right__nav__list__item">
              <Link href="/pages/Albums">
                <p className="nav__link">Albums</p>
              </Link>
            </li>
            <li className="header__main__right__nav__list__item">
              <Link href="/pages/Tracks">
                <p className="nav__link">Tracks</p>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Index;

import React from 'react';
import Link from 'next/link';
import '../../styles/components/card.scss';
import Image from 'next/image';
import EditIcon from '../../assets/icons/edit-icon.svg';
import DeleteIcon from '../../assets/icons/delete-icon.svg';

const Index = props => {
  return (
    <>
      {props.type === 'artist' ? (
        <>
          <div className="card-wrapper">
            <div className="card-wrapper__left">
              <Link
                className="card-wrapper__left__link"
                href={`/artists/${props.artist._id}`}>
                <p className="card-wrapper__left__link__text">
                  {props.artist.name}
                </p>
              </Link>
            </div>
            <div className="card-wrapper__right">
              <Image
                className="card-wrapper__right__edit-icon"
                src={EditIcon}
                alt="EDIT"
              />
              <Image
                className="card-wrapper__right__delete-icon"
                src={DeleteIcon}
                alt="DELETE"
              />
            </div>
          </div>
        </>
      ) : props.type === 'album' ? (
        <div className="card-wrapper">
          <div className="card-wrapper__left">
            <Link
              className="card-wrapper__left__link"
              href={`/album/${props.album._id}`}>
              <p className="card-wrapper__left__link__text">
                {props.album.title}
              </p>
            </Link>
          </div>
          <div className="card-wrapper__right">
            <Image
              className="card-wrapper__right__edit-icon"
              src={EditIcon}
              alt="EDIT"
            />
            <Image
              className="card-wrapper__right__delete-icon"
              src={DeleteIcon}
              alt="DELETE"
            />
          </div>
        </div>
      ) : props.type === 'track' ? (
        <div className="card-wrapper">
          <div className="card-wrapper__left">
            <Link
              className="card-wrapper__left__link"
              href={`/track/${props.track._id}`}>
              <p className="card-wrapper__left__link__text">
                {props.track.title}
              </p>
            </Link>
          </div>
          <div className="card-wrapper__right">
            <Image
              className="card-wrapper__right__edit-icon"
              src={EditIcon}
              alt="EDIT"
            />
            <Image
              className="card-wrapper__right__delete-icon"
              src={DeleteIcon}
              alt="DELETE"
            />
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Index;

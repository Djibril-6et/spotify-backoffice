const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const musicMetadata = require('music-metadata-browser');
dotenv.config();
// import {getOneTrackByName} from '@/services/tracks.services';
const axios = require('axios').default;

const addTrackToBase = async file => {
  try {
    const serverFileURL = `${serverBaseURL}/${encodeURIComponent(
      file.name,
    ).replace(/%2F/g, '/')}`;

    if (path.extname(file.name).toLowerCase() === '.m4a') {
      const metadata = await musicMetadata.parseBlob(file);

      const artistInstance = await Artist.findOneAndUpdate(
        {name: metadata.common.artist},
        {
          $setOnInsert: {name: metadata.common.artist},
        },
        {upsert: true, new: true},
      );

      const albumInstance = await Album.findOneAndUpdate(
        {title: metadata.common.album, artist: artistInstance._id},
        {
          $setOnInsert: {
            title: metadata.common.album,
            artist: artistInstance._id,
            cover: `${serverBaseURL}/${encodeURIComponent(
              metadata.common.album,
            )}/cover.jpg`,
          },
        },
        {upsert: true, new: true},
      );

      const trackInstance = new Track({
        title: metadata.common.title,
        duration: metadata.format.duration,
        url: serverFileURL,
        cover: albumInstance.cover,
        album: albumInstance._id,
        artist: artistInstance._id,
      });

      await trackInstance.save();

      await Album.findOneAndUpdate(
        {_id: albumInstance._id},
        {$push: {tracks: trackInstance._id}},
        {new: true},
      );

      await Artist.findOneAndUpdate(
        {_id: artistInstance._id},
        {
          $addToSet: {
            albums: albumInstance._id,
            tracks: trackInstance._id,
          },
        },
        {new: true},
      );

      console.log('Metadata inserted:', metadata.common.title);
    }
  } catch (error) {
    console.error('Error processing track:', error);
  }
};

module.exports = {
  addTrackToBase,
};

// USE API

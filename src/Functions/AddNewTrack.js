// AddNewTrack.js
const AWS = require('aws-sdk');
const musicMetadata = require('music-metadata-browser');
const dotenv = require('dotenv');
dotenv.config();

AWS.config.update({
  accessKeyId: process.env.NEXT_PUBLIC_accessKeyId,
  secretAccessKey: process.env.NEXT_PUBLIC_secretAccessKey,
  region: 'eu-west-3',
});

const s3 = new AWS.S3();
const bucketName = 'tracksbucket';

const processedAlbums = {};

const uploadNewTrack = async track => {
  const file = track.audioFile;

  if (file) {
    try {
      const metadata = await musicMetadata.parseBlob(file);
      const albumName = track.album || metadata.common.album;

      if (!processedAlbums[albumName]) {
        processedAlbums[albumName] = true;

        if (metadata.common.picture && metadata.common.picture.length > 0) {
          const coverData = metadata.common.picture[0].data;
          const coverStream = Buffer.from(coverData);
          const coverKey = albumName + '/cover.jpg';

          const coverUploadParams = {
            Bucket: bucketName,
            Key: coverKey,
            Body: coverStream,
          };

          const coverUploadResult = await s3
            .upload(coverUploadParams)
            .promise();

          console.log(
            `Couverture pour l'album ${albumName} uploadée avec succès. URL S3 :`,
            coverUploadResult.Location,
          );
        }
      }

      const uploadParams = {
        Bucket: bucketName,
        Key: albumName + '/' + file.name,
        Body: file,
      };

      const data = await s3.upload(uploadParams).promise();

      console.log(`Fichier uploadé avec succès. URL S3 :`, data.Location);
    } catch (error) {
      console.error(
        `Erreur lors de la lecture des métadonnées du fichier :`,
        error,
      );
    }
  } else {
    console.error("Le fichier spécifié n'est pas un Buffer.");
  }
};

module.exports = {
  uploadNewTrack,
};

/** @type {import('next').NextConfig} */
module.exports = {
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_ACCESS_KEY_ID: process.env.NEXT_PUBLIC_accessKeyId,
    NEXT_PUBLIC_SECRET_ACCESS_KEY: process.env.NEXT_PUBLIC_secretAccessKey,
  },
};

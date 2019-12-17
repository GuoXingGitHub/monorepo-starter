export default {
  bucket: process.env.ATTACHMENT_BUCKET || 'tnc-dev.appspot.com',
  origin: process.env.ATTACHMENT_ORIGIN || 'http://localhost:3000',
};

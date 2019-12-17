import * as admin from 'firebase-admin';

import AppConfig from './app';

export default {
  credential: AppConfig.isGAE()
    ? admin.credential.applicationDefault()
    : admin.credential.cert('firebase-keyfile.json'),
  databaseURL: process.env.FIREBASE_DATABASE_URL || 'https://tnc-dev.firebaseio.com',
};

import firebase from 'firebase';
import { FIREBASE_WEB_API_KEY, FIREBASE_AUTH_DOMAIN } from './AppConstants'

const config = {
  apiKey: FIREBASE_WEB_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
};
firebase.initializeApp(config);

export default firebase;

import firebase from 'firebase';
import { FACEBOOK_SECRET, FIREBASE_AUTH_DOMAIN } from './AppConstants'

const config = {
  apiKey: FACEBOOK_SECRET,
  authDomain: FIREBASE_AUTH_DOMAIN,
};
firebase.initializeApp(config);

export default firebase;

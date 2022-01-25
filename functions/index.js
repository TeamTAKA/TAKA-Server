const admin = require('firebase-admin');
const serviceAccount = require('./taka-1dd38-firebase-adminsdk-6qkk2-a2e2159e1b');
const dotenv = require('dotenv');

dotenv.config();

let firebase;
if (admin.apps.length === 0) {
  firebase = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} else {
  firebase = admin.app();
}

module.exports = {
  api: require('./api'),
};

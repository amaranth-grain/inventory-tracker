const admin = require('firebase-admin');
const serviceAccount = require("../key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://inventory-tracker-db4a8.firebaseio.com",
});

const db = admin.firestore();

module.exports = { admin, db };
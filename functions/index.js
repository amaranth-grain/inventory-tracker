const functions = require("firebase-functions");
const firebase = require("firebase");
const app = require("express")();
const config = require("./util/config");
const Busboy = require('busboy');
const { uploadImage } = require('./handlers/users');

firebase.initializeApp(config);

// Imported route handlers
const authRoutes = require("./handlers/auth");
const inventoryRoutes = require("./handlers/inventory");
const userRoutes = require("./handlers/users");
// Namespace for routes
app.use('/user', userRoutes);
app.use('/auth', authRoutes);
app.use('/inventory', inventoryRoutes);

// app.post('/user/image', uploadImage);

exports.api = functions.region("us-west2").https.onRequest(app);

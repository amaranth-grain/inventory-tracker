const express = require("express");
const routes = express.Router();
const { validateUserBio } = require("../util/validaton");
const { admin, db } = require("../util/admin");
const { FBAuth } = require("../util/fbAuth");
const { v4: uuidv4 } = require("uuid");
const config = require("../util/config");
const Busboy = require("busboy");
const path = require("path");
const os = require("os");
const fs = require("fs");

/**
 * Upload image and update user.photoURL with the
 */
routes.post('/image', FBAuth, async(req, res) => {
		const busboy = new Busboy({ headers: req.headers });
		let imageFilename = 'default.png';
		let image = {};
		let photoURL;
		// When multipart/form-data is received, create unique filename & save to tmpdir
		busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
			const ext = filename.split('.').pop();
			imageFilename = `${uuidv4()}.${ext}`;
			const filepath = path.join(os.tmpdir(), imageFilename);
			image = { filepath, mimetype };
			file.pipe(fs.createWriteStream(filepath));
			photoURL = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFilename}?alt=media`;
		});
		// Upload image to Firebase storage from tmpdir
		busboy.on('finish', async () => {
			await admin.storage().bucket(config.storageBucket).upload(image.filepath, {
				resumable: false,
				metadata: {
					metadata: {
						contentType: image.mimetype
					}
				}
			});
			// Update user.photoURL with URL of uploaded file
			try {
				await admin.auth().updateUser(req.user.uid, { photoURL });
				res.status(201).json({ message: `${imageFilename} successfully uploaded`, photoURL});
			} catch (error) {
				res.status(500).json({error: `${photoURL} could not be uploaded || ${error} || ${error.code}`});
			}
		});
		busboy.end(req.rawBody);
});

/**
 * Update user bio info. Identified through uid.
 * Creates a new document in 'users' collection if it doesn't exist.
 * Updates existing document { merge: true } if document exists.
 * Basic user fields are stored as Firebase user fields.
 */
routes.post('/bio', FBAuth, async(req, res) => {
	const userBio = validateUserBio(req.body);
	try {
		await db.collection('users').doc(req.user.uid).set(userBio, { merge: true });
		res.status(200).json({ message: `Successfully updated bio for user ${req.user.uid}`});
	} catch (error) {
		res.status(500).json({ error: `${error} || ${error.code}`});
	}
});

/**
 * Get user information on logged in user
 */
//TODO comments for user profiles
routes.get('/', FBAuth, async(req, res) => {
	let userData = {};
	const user = await db.doc(`/users/${req.user.uid}`).get();
	if (!user) res.status(500).json({ message: `Could not retrieve bio for req.user.uid`});
	
	try {
		userData.bio = user.data() || {};
		const data = await db.collection('sales').where('uid', '==', req.user.uid).get();
		const authUser = await admin.auth().getUser(req.user.uid);
		userData.salesEvents = [];
		data.forEach(doc => {
			userData.salesEvents.push(doc.data());
		});
		userData.user = { ... authUser };
		res.status(200).json(userData);
	} catch (error) {
		res.status(500).json({ error: `${error} || ${error.code}`});
	}
});

module.exports = routes;




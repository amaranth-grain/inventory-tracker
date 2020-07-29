const express = require('express');
const routes = express.Router();
const firebase = require("firebase");
const asyncHandler = require("express-async-handler");
const { validateNewUser, validateLogin, isEmpty } = require("../util/validaton");


routes.post("/login", asyncHandler(async (req, res) => {
	const user = {
		email: req.body.email,
		password: req.body.password
	};
	let errors = validateLogin(user);
	if (!isEmpty(errors)) return res.status(400).json(errors);
	await loginUser(user, res);
}));

routes.post("/signup", asyncHandler(async (req, res) => {
	// Get user info based on form input
	const user = {
		email: req.body.email,
		password: req.body.password,
		confirmPassword: req.body.confirmPassword,
		displayName: req.body.displayName,
	};
	let errors = validateNewUser(user);
	if (!isEmpty(errors)) return res.status(400).json(errors);
	await createUser(user, res);
}));



/*** HELPER METHODS ***/
/**
 * Login user based on validated credentials
 * @param {string input} user 
 * @param {*} res 
 */
const loginUser = async (user, res) => {
	try {
		//Sign in
		await firebase.auth().signInWithEmailAndPassword(user.email, user.password);
		// Return token if login is successful
		firebase.auth().onAuthStateChanged(async (user) => {
			if (user) {
				let token = await user.getIdToken();
				return res.status(200).json({ token });
			} else {
				res.status(500).json({message: `Couldn't log in`});
			}
		});
	} catch (error) {
		if (error.code == 'auth/wrong-password') {
			return res.status(403).json({ general: `Email and password do not match`});
		}
		res.status(500).json({ message: `${error} || ${error.code}`});
	}

}

/**
 * Create a user based on validated inputs
 * @param {validatedUser} user 
 * @param {*} res 
 */
const createUser = async (user, res) => {
	try {
		let data = await firebase.auth().createUserWithEmailAndPassword(user.email, user.password);
		// Update user with display name and default avatar
		await firebase.auth().currentUser.updateProfile({
			displayName: user.displayName,
			photoURL: `https://api.adorable.io/avatars/285/${user.email}.png`,
		});
		// Return token ID if user is created
		let token = await data.user.getIdToken();
		res.status(201).json({ token });
	} catch (error) {
		if (error.code == "auth/email-already-in-use") {
			return res.status(400).json({ email: `Email already in use. || ${error}` });
		} 
		res.status(500).json({ message: `${error} (${error.code})` });
	}
}



module.exports = routes;
const express = require('express');
const routes = express.Router();
const asyncHandler = require("express-async-handler");
const { FBAuth } = require("../util/fbAuth");
const { db } = require("../util/admin");

/**
 * Return the inventory for logged in user
 */
routes.get('/', FBAuth, asyncHandler(async (req, res) => {
	let inventory = [];
	// Retrieve inventory for logged in user
	let data = await db.collection("inventory").where("userId", "==", `${req.user.uid}`).get();
	
	data.forEach((doc) => {
		inventory.push({
			invId: doc.id,
			...doc.data(),
		});
	});

	if (inventory.length == 0) {
		return res.json({ message: `No inventory found for ${req.user.email}`});
	}
	res.json(inventory);		
}));

/**
 * Get inventory item based on unique id
 */
routes.get('/:id', async(req, res) => {
	let itemData = {};
	let doc = await db.doc(`/inventory/${req.params.id}`).get();
	if (!doc) res.status(404).json({ error: `Item ${req.params.itemId} not found`});
	itemData = doc.data();
	itemData.id = doc.id;
	res.json(itemData);
});

/**
 * Add inventory item after user is authenticated through FBAuth
 */
routes.post('/add', FBAuth, asyncHandler(async (req, res) => {
	const item = {
		uid: req.user.uid,
		stock: req.body.stock,
		price: req.body.price,
		itemName: req.body.itemName,
		itemId: req.body.itemId,
		itemDesc: req.body.itemDesc
	}

	try {
		let doc = await db.collection('inventory').add(item);
		res.status(201).json({ message: `Inventory item ${doc.id} added successfully`});
	} catch (error) {
		res.status(500).json({ error: `Inventory item could not be added || ${error} (${error.code})`});
	}
}));


module.exports = routes;
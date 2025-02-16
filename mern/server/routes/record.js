import express from 'express';

import db from '../db/connection.js';
const router = express.Router();
import { ObjectId } from 'mongodb';

//GET products
router.get('/products', async (req, res) => {
	const productsCollection = db.collection('product');
	const page = parseInt(req.query.page) || 1;
	const limit = parseInt(req.query.limit) || 5;
	const skip = (page - 1) * limit;

	const totalProducts = await productsCollection.countDocuments();
	const products = await productsCollection
		.find()
		.skip(skip)
		.limit(limit)
		.toArray();

	res.json({
		totalProducts,
		totalPages: Math.ceil(totalProducts / limit),
		currentPage: page,
		products,
	});
});
//POST
router.post('/addproducts', async (req, res) => {
	const productsCollection = db.collection('product');
	const products = req.body;
	const result = await productsCollection.insertOne(products);
	res.json(result);
});
//PUT
router.put('/updateproduct/:id', async (req, res) => {
	const productsCollection = db.collection('product');
	const id = req.params.id;
	const product = req.body;
	console.log('id', id);
	const filter = { _id: new ObjectId(id) };

	const options = { upsert: true };
	const updateDoc = {
		$set: product,
	};
	const result = await productsCollection.updateOne(
		filter,
		updateDoc,
		options
	);

	res.json(result);
});
//DELETE
router.delete('/deleteproduct/:id', async (req, res) => {
	const productsCollection = db.collection('product');
	const id = req.params.id;
	const query = { _id: new ObjectId(id) };
	const result = await productsCollection.deleteOne(query);
	res.json(result);
});

export default router;

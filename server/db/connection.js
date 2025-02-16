import dotenv from 'dotenv';
dotenv.config();

import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.072tx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});

try {
	// Connect the client to the server
	await client.connect();
	// Send a ping to confirm a successful connection
	await client.db('admin').command({ ping: 1 });
	console.log(
		'Pinged your deployment. You successfully connected to MongoDB!'
	);
} catch (err) {
	console.error(err);
}

const db = client.db('crud-project');

export default db;

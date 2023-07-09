const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("node:fs");
const path = require("path");
const fetch = require("node-fetch")
require("dotenv").config();
const app = express();
const { MongoClient } = require('mongodb');

// Middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

// Endpoints Map
const apiEndpoints = new Map();
const apiEndpointsFiles = fs
	.readdirSync("./endpoints")
	.filter((file) => file.endsWith(".js"));

for (const file of apiEndpointsFiles) {
	const endpoint = require(`./endpoints/${file}`);
	apiEndpoints.set(endpoint.name, endpoint);
}

// Documentation Map
/*const docs = new Map();
const documentationFiles = fs
	.readdirSync("./docs")
	.filter((file) => file.endsWith(".md"));

for (const file of documentationFiles) {
	markdown(fs.readFileSync(`./docs/${file}`, "utf8"), (error, result) => {
		if (error) return logger.error("Markdown", error);
		else {
			const metadata = result.attributes;
			const html = result.html;

			docs.set(metadata.title, {
				metadata: metadata,
				html: DOMPurify.sanitize(marked.parse(html)),
			});
		}
	});
}
*/
// DB
const url = `mongodb+srv://noteysdb:noteysdb@noteysdb.azj3dtk.mongodb.net/`;
const client = new MongoClient(url);

// API Endpoints
app.all(`/api/:endpoint`, async (req, res) => {
	const endpoint = `${req.params.endpoint}`;
	const data = apiEndpoints.get(endpoint);

	if (data) {
		if (data.method != req.method)
			return res.status(405).json({
				error: `Method "${data.method}" is not allowed for endpoint "${endpoint}"`,
			});

		try {
			await data.execute(
				req,
				res,
				fetch,
                client
			);
		} catch (error) {
			res.status(500).json({
				error: "Internal Server Error",
				message: "An error occurred while processing your request.",
			});

			console.error(`API (${endpoint})`, error);
		}
	} else
		return res.status(404).json({
			error: "This endpoint does not exist.",
		});
});
app.get("/", async (req, res) => {
	res.send("Welcome to the Noteys Application Programming Interface! 👋")
});

// RUN
app.listen(process.env.PORT, () => {
	client.connect(function(err) {
		if (err) {
		  console.error('Failed to connect to the database:', err);
		  return;
		}
		console.log('Connected successfully to the database');
	  });
    console.log(`[Application Programming Interface] - Running - ${process.env.PORT}`)
});
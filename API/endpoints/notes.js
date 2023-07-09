const { MongoClient } = require("mongodb");

module.exports = {
	name: "all_notes",
	method: "GET",
    /**
     * 
     * @param {import("express").Request} req 
     * @param {import("express").Response} res 
     * @param {MongoClient} client 
     */
	execute: async (req, res, fetch, client) => {
                async function getAllNotes() {
                        try {
                          await client.connect();
                          const db = client.db('noteysDB');
                          const notesCollection = db.collection('notes');
                          const notes = await notesCollection.find({}).toArray();
                          return notes;
                        } catch (err) {
                          console.error('Failed to fetch notes:', err);
                        }
                      };
                      res.send(await getAllNotes());
	},
};
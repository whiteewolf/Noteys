const { MongoClient } = require("mongodb");

module.exports = {
	name: "add_notes",
	method: "GET",
    /**
     * 
     * @param {import("express").Request} req 
     * @param {import("express").Response} res 
     * @param {MongoClient} client 
     */
	execute: async (req, res, fetch, client) => {
        async function insertNote(note) {
            try {
              const db = client.db('noteysDB');
              const notesCollection = db.collection('notes');
              const result = await notesCollection.insertOne(note);
              console.log('Note inserted successfully');
              return result.insertedId;
            } catch (err) {
              console.error('Failed to insert note:', err);
            } finally {
              await client.close();
            }
          }
          const note = {title: 'First Note 2', content: 'This is a test #2 note lmao....!'};
          insertNote(note).then(insertedId => {
            console.log('Inserted note ID:', insertedId);
            res.send("Note Addded")
          })
          .catch(err => {
            console.error('Error:', err);
          });
          
    },
};
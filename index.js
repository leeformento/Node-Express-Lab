// import your node modules
const express = require('express');
const db = require('./data/db.js');
const cors = require('cors');

// add your server code starting here
const server = express();

// middleware - put when doing react app
server.use(cors());
server.use(express.json());

// starting point
server.get('/', (req, res) => {
    res.send('Home');
})
// request handlers.
// GET
server.get('/api/posts', (req, res) => {
    db.find().then(post => {
        console.log('\n** post **', post);
        res.status(200).json(post);
    })
    .catch(err => res.status(500).json({ error: "The post information could not be retrieved."}));
})

server.get('/api/posts/:id', (req, res) => {
    const { id } = req.params;
    db.findById(id)
    .then(post => {
        if (post.length === 0) {
            res.status(404).json({ error: "The post with the specified ID does not exist." });
        } else {
        res.json(post);
    }})
    .catch(err => res.status(500).json({ error: "The post information could not be retrieved." }));
})

// POST
server.post('/api/posts', (req, res) => {
    if (!req.body || !req.body.title || !req.body.contents) {
        res.status(400).json({ error: "Please provide title and contents for the post." })
    }
    const { title, contents } = req.body;
    const newPost = { title, contents };
    db.insert(newPost)

       .then(insertedPost => {
           res.status(201) // created
       })
       .catch(err => (res.status(500).json({ error: 'There was an error while saving the post to the database.' })))
    })

// DELETE
server.delete('/api/posts/:id', (req, res) => {
    console.log(req.params);
    const { id } = req.params;
    db.remove(id)
    .then(removedPost => {
        console.log(removedPost);
        if(!id) {
            return res.status(404).json({ message: "The post with the specified ID does not exist." });
        }
        res.status(200).json({ message: `The post with id ${ id } was successfully deleted.`});
    })
    .catch(err => res.status(500).json({ error: "The post could not be removed" }));
})

// UPDATE
server.put('/api/posts/:id', (req,res) => {
    if (!req.body || !req.body.title || !req.body.contents) {
        res.status(400).json({ error: "Please provide title and contents for the post." })
    }
    const { id } = req.params;
    const { title, contents } = req.body;
    const newPost = { title, contents };
    console.log(newPost);
    db.update(id, newPost)
    .then( post => {
        console.log(post);
        res.status(200).json({ post, message: 'ok' });
    })
    .catch(err => res.status(500).json({ error: "The post information could not be modified." }));
})

const port = 8000;
server.listen(port, () => console.log(`API running on port ${port}`))


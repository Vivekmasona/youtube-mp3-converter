const express = require('express');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const contentDisposition = require('content-disposition');
const { promises: Fs } = require('fs')

// const pythonConverter = require('../util/pythonConverter');
const jsConverter = require('../util/jsConverter');

const router = express.Router();

app.get('/', async (req, res) => {
    res.send({ ok: "ok" });
});

// route to send youtube link and download it on local server
app.get('/convert', async (req, res) => {
    try {
        const link = req.body.link; 
        if(!link) {
            throw new Error('Link not provided!');
        }
        const response = await jsConverter(link);
        res.send(response);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// route to download a specific file from the server
app.get('/download', async (req, res) => {
    try {
        const token = req.body.token;
        if(!token) {
            throw new Error('Token not provided!');
        }
        const decoded = jwt.verify(token, process.env.AUTH_STRING);
        
        const CONVERTED_DIR = path.join(__dirname, '..', 'converted');
        const file_path = path.join(CONVERTED_DIR, `${decoded._id}.mp3`);
        const stat = fs.statSync(file_path);
        res.writeHead(200, {
            'Content-Disposition': contentDisposition(`${decoded._name}.mp3`),
            'Content-Type': 'audio/mp3',
            'Content-Length': stat.size,
        });
        const readStream = fs.createReadStream(file_path);
        readStream.pipe(res);
    } catch (error) {
        res.status(400).send({ error: 'File not found on server', message: error.message });
        console.log(error)
        return;
    }
});

module.exports = router;

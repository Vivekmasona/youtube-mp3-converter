const express = require('express');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const contentDisposition = require('content-disposition');
const { promises: Fs } = require('fs')

// const pythonConverter = require('../util/pythonConverter');
const jsConverter = require('../util/jsConverter');
const getTime = require('../util/getTime');

const router = express.Router();

router.get('/', async (req, res) => {
    res.send({ ok: "ok" });
});

// route to send youtube link and download it on local server
router.post('/convert', async (req, res) => {
    try {
        const link = req.body.link; 
        if(!link) {
            throw new Error('Link not provided!');
        }
        
        const response = await jsConverter(link, index);
        console.log('Finished')
        res.send(response);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// route to download a specific file from the server
router.post('/download', async (req, res) => {
    const CONVERTED_DIR = path.join(__dirname, '..', 'converted');
    // token received from server
    const token = req.body.token;
    if(!token) {
        res.status(400).send({ error: 'Token not provided!' });
        return;
    }
    let file_path;
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.AUTH_STRING);
        file_path = path.join(CONVERTED_DIR, `${decoded._id}.mp3`);
        await Fs.access(file_path); 
    } catch (error) {
        res.status(400).send({ error: 'File not found on server', message: error.message });
        console.log(error)
        return;
    }
    const stat = fs.statSync(file_path);
    res.writeHead(200, {
        'Content-Disposition': contentDisposition(`${decoded._name}.mp3`),
        'Content-Type': 'audio/mp3',
        'Content-Length': stat.size,
    });
    const readStream = fs.createReadStream(file_path);
    readStream.pipe(res);
});

module.exports = router;
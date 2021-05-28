const express = require('express');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const { promises: Fs } = require('fs')

const pythonConverter = require('../util/pythonConverter');

const router = express.Router();

router.get('/', async (req, res) => {
    res.send({ ok: "ok" });
});

// route to send youtube link and download it on local server
router.get('/convert', async (req, res) => {
    try {
        const link = req.body.link;
        // encode the name for easy access
        pythonConverter({ link }, ({data, error}) => {
            if(data) {
                res.send(data);
            }
            if(error) {
                throw error
            }
        })        
    } catch (error) {
        res.status(400).send({error: error.message})
    }   
});

// route to download a specific file from the server
router.get('/download', async (req, res) => {
    const CONVERTED_DIR = path.join(__dirname, '..', 'python_script', 'converted');
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
        file_path = path.join(CONVERTED_DIR, `${token}.mp3`);
        await Fs.access(file_path); 
    } catch (error) {
        res.status(400).send({ error: 'File not found on server', message: error.message });
        return;
    }
    const stat = fs.statSync(file_path);
    res.writeHead(200, {
        'Content-Disposition': `attachment; filename="${decoded._name}.mp3"`,
        'Content-Type': 'audio/mp3',
        'Content-Length': stat.size,
    });
    const readStream = fs.createReadStream(file_path);
    readStream.pipe(res);
});

module.exports = router;
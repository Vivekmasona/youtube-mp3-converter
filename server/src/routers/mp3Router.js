const express = require('express');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const { PythonShell } = require('python-shell');
const { promises: Fs } = require('fs')

const router = express.Router();

router.get('/', async (req, res) => {
    res.send({ ok: "ok" });
});

// route to send youtube link and download it on local server
router.get('/convert', async (req, res) => {
    
    try {
        const link = req.body.link;
        const python_script_location = path.join(__dirname, '..', 'python_script', 'get-video-audio.py');
        // call python script
        const pythonOptions = {
            mode: 'json',
            // scriptPath: '/some/location/small_script.py',
            // pythonPath: '/usr/bin/python3',
            args: [link]
        };
        const pyshell = new PythonShell(python_script_location, pythonOptions);
        pyshell.on('message', function (message) {
            pythonData = message
        });
        pyshell.end(function (err) {
            if (err) {
                throw err
            }
            const token = jwt.sign({ _name: pythonData.title }, process.env.AUTH_STRING);
            // Send this to the user
            res.send({ data:  pythonData, token })
        });
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
        file_path = path.join(CONVERTED_DIR, `${decoded._name}.mp3`);
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
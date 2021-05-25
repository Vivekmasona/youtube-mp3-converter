const express = require('express');
const {PythonShell} = require('python-shell');
const path = require('path');

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
            // Send this to the user
            res.send({ data:  pythonData })
        });
    } catch (error) {
        res.status(400).send({error: error.message})
    }
    
});

module.exports = router;
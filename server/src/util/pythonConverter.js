const getYoutubeTitle = require('get-youtube-title');
const { PythonShell } = require('python-shell');
const jwt = require('jsonwebtoken');
const path = require('path');

const pythonConverter = ({ link }, callback) => {
    // script to download and convert video
    const python_script_location = path.join(__dirname, '..', 'python_script', 'get-video-audio.py');
    const pythonOptions = {
        mode: 'json',
        // scriptPath: '/some/location/small_script.py',
        // pythonPath: '/usr/bin/python3',
        args: [link]
    };
    
    let pythonData;
    const pyshell = new PythonShell(python_script_location, pythonOptions);
    pyshell.on('message', function (message) {
        pythonData = message
    });
    pyshell.end(function (err) {
        if (err) {
            callback({ error: err })
        }
        const token = jwt.sign({ _name: pythonData.title }, process.env.AUTH_STRING);
        // Send this to the user
        callback({ data: { data:  pythonData, token } })
    });

};

module.exports = pythonConverter;
const getYoutubeTitle = require('get-youtube-title');
const { PythonShell } = require('python-shell');
const jwt = require('jsonwebtoken');
const path = require('path');

const pythonConverter = ({ link }, callback) => {
    const regex = 'v=[a-zA-Z0-9_]*';
    const link_regex = link.match(regex);
    if(!link_regex) {
        callback({ error: 'Link not proper' });
    }
    const id = link_regex[0].replace('v=', '');
    let video_title;
    getYoutubeTitle(id, function (err, title) {
        if(err) {
            callback({ error: 'Youtube video not available' });
        }
        video_title = title;
    });

    // script to download and convert video
    const python_script_location = path.join(__dirname, '..', 'python_script', 'get-video-audio.py');
    // convert title to token for easy access
    const token = jwt.sign({ _name: video_title }, process.env.AUTH_STRING);

    const pythonOptions = {
        mode: 'json',
        args: [link, token]
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
        // Send this to the user
        callback({ data: pythonData })
    });

};

module.exports = pythonConverter;
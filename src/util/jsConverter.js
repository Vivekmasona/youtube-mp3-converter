const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const jwt = require('jsonwebtoken');

// function to convert callback ffmpeg into Promise based
const ffmpegSync = (stream, info, storage_location) => {
    return new Promise((resolve, reject) => {
        ffmpeg(stream)
            .audioBitrate(128)
            .withAudioCodec("libmp3lame")
            .toFormat("mp3")
            .saveToFile(storage_location)
            .on("error", function(err) {
                console.log('error', err);
                return reject(new Error(err));
            })
            .on("end", function() {
                resolve({ success: true });
            });
    })
};

const jsConverter = async (link) => {
    const info = await ytdl.getInfo(link, { quality: 'highestaudio' });
    // making unique jwt token for storage
    const token = jwt.sign({ _name: info['player_response']['videoDetails']['title'] }, process.env.AUTH_STRING);
    const storage_location = path.join(__dirname, '..', 'python_script', 'converted', `${token}.mp3`);

    // downloading and converting to mp3
    const stream = ytdl.downloadFromInfo(info, {
        quality: 'highestaudio'
    });  
    const response = await ffmpegSync(stream, info, storage_location);
    return { meta: info['player_response']['videoDetails'], token };
};

module.exports = jsConverter;
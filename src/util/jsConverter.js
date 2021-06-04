const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

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
    });
};

const jsConverter = async (link) => {
    const info = await ytdl.getInfo(link, { quality: 'highestaudio' });

    const converted_folder = path.join(__dirname, '..', 'converted');
    if (!fs.existsSync(converted_folder)) {
        fs.mkdirSync(converted_folder)
    }
    // making unique jwt token for storage
    const meta = info['player_response']['videoDetails'];
    const token = jwt.sign({ _id: meta['videoId'], _name: meta['title'] }, process.env.AUTH_STRING);
    const storage_location = path.join(converted_folder, `${meta['videoId']}.mp3`);

    // downloading and converting to mp3
    const stream = ytdl.downloadFromInfo(info, {
        quality: 'highestaudio'
    });  
    const response = await ffmpegSync(stream, info, storage_location);
    return { meta, token };
};

module.exports = jsConverter;
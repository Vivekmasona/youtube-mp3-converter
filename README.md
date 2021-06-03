## Youtube-Mp3 Converter

This is an application that takes in a Youtube link and returns the mp3 version of it. The Node.js server uses the 'ytdl-core' npm module to download the video, which is then converted to .mp3 file by using the 'ffmpeg' tool.
I made a simple frontend to interact with this server. It is a React application that uses Material UI for the design. The design itself is nothing fancy and is kept relatively simple. I have also implemented queueing of requests on the front-end so that the server doesn't get overloaded with requests(and therefore overload the ytdl-core servers). 

The live version of this application is available on the free tier of hosting on Heroku:
https://lesasi-youtube-mp3-converter.herokuapp.com

This project is done merely for practice, and out of my own interest. I certainly don't plan to use it for any commercial purposes, so please don't sue me, Youtube.
